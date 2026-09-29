// image-compress.ts — redimensiona y recomprime una imagen EN EL NAVEGADOR
// antes de subirla, usando el Canvas API nativo (sin dependencias extra).
//
// Por qué: ImageUploader acepta hasta 5MB sin tocar el archivo. Si alguien
// sube una foto de celular sin editar (fácil 3000×4000px, varios MB), ese
// archivo queda como el "origen" en Vercel Blob. next/image sí optimiza y
// reformatea (WebP/AVIF) lo que se sirve al público, pero necesita bajar
// ese origen pesado la PRIMERA vez que lo transforma (caché fría de Vercel)
// — y esa primera transformación es lenta. Comprimir del lado del cliente
// antes de subir ataca el problema de raíz: el origen nunca llega a pesar
// varios MB.
//
// Si algo falla (navegador sin soporte para alguna API, imagen corrupta,
// etc.) devolvemos el archivo original tal cual — nunca queremos bloquear
// una subida legítima por esto.

interface CompressOptions {
  /** Ancho máximo en px. Si la imagen ya es más angosta, no se toca. */
  maxWidth: number;
  /** Calidad de recompresión (0-1). Default 0.82, buen balance peso/nitidez. */
  quality?: number;
}

export async function resizeAndCompressImage(
  file: File,
  { maxWidth, quality = 0.82 }: CompressOptions
): Promise<File> {
  // Los SVG son vectoriales: no hay nada que redimensionar ni recomprimir.
  if (file.type === 'image/svg+xml') return file;

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxWidth / bitmap.width);
    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);

    // Ya es más chica que el límite y pesa poco — no hace falta reprocesar.
    if (scale === 1 && file.size <= 400 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    // PNG se mantiene PNG (puede tener transparencia); todo lo demás sale
    // como JPEG, que comprime muchísimo mejor para fotos/screenshots.
    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, quality)
    );

    // Si por algún motivo la versión "comprimida" salió igual o más pesada
    // que la original (pasa con imágenes ya muy chicas o muy comprimidas),
    // nos quedamos con la original.
    if (!blob || blob.size >= file.size) return file;

    const extension = outputType === 'image/png' ? 'png' : 'jpg';
    const newName = file.name.replace(/\.\w+$/, '') + `.${extension}`;

    return new File([blob], newName, { type: outputType });
  } catch (err) {
    console.error('No se pudo comprimir la imagen, se sube el original:', err);
    return file;
  }
}