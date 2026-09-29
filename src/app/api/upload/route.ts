import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Solo una sesión admin válida puede obtener un token de subida.
        // Esto es lo que evita que cualquiera suba archivos a tu storage.
        const session = await auth();
        if (!session?.user) {
          throw new Error('No autorizado');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Nota: este callback solo se dispara en producción (vía webhook de
        // Vercel), no en desarrollo local. No pongas acá lógica imprescindible
        // — el flujo principal ya resuelve la URL del lado del cliente.
        console.log('[blob] subida completada:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
