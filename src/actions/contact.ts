'use server';

import { Resend } from 'resend';
import { ContactSchema } from '@/lib/validations';
import { ok, err, type ActionResult } from '@/lib/action-types';
import { isRateLimited, recordFailedAttempt, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

// A dónde llegan los mensajes del formulario público. Se puede pisar con
// CONTACT_TO_EMAIL en .env.local sin tocar código.
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'angelberretta.dev@gmail.com';

/**
 * Server Action del formulario de contacto público.
 *
 * Reemplaza el envío client-side por EmailJS (que viajaba con el Service ID,
 * Template ID y Public Key expuestos en el bundle del navegador) por un
 * envío 100% server-side: la API key de Resend nunca sale del servidor.
 *
 * Rate limiting: reusa la tabla LoginAttempt de lib/rate-limit.ts con un
 * prefijo distinto ("contact:<ip>") para no mezclar estos intentos con los
 * de login — mismo mecanismo, sin necesitar tabla ni migración nueva.
 */
export async function sendContactMessage(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const ip = await getClientIp();
  const rateLimitKey = `contact:${ip}`;

  if (await isRateLimited(rateLimitKey)) {
    return err('Demasiados mensajes enviados. Esperá unos minutos antes de volver a intentar.');
  }

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: (formData.get('subject') as string) || undefined,
    message: formData.get('message') as string,
  };

  // Honeypot: campo oculto que un humano nunca completa. Si llega con
  // contenido, es un bot — devolvemos éxito falso para no delatar la trampa.
  const honeypot = formData.get('company') as string;
  if (honeypot) {
    return ok();
  }

  const validated = ContactSchema.safeParse(raw);
  if (!validated.success) {
    return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
  }

  // Contamos el intento ANTES de enviar: así un atacante no puede saltarse
  // el límite mandando mensajes "válidos" sin parar.
  await recordFailedAttempt(rateLimitKey);

  const { name, email, subject, message } = validated.data;

  try {
    await resend.emails.send({
      // onboarding@resend.dev funciona sin verificar dominio propio, pero
      // Resend solo deja entregar con esa dirección a tu propio email de
      // cuenta — que es justo CONTACT_TO_EMAIL, así que alcanza para este
      // caso. Si más adelante verificás un dominio propio en Resend, podés
      // cambiar esto a algo como `Portfolio <contacto@tudominio.com>`.
      from: 'Portfolio <onboarding@resend.dev>',
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subject || `Nuevo mensaje de ${name} desde el portfolio`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      html: renderContactEmailHtml({ name, email, subject, message }),
    });

    return ok();
  } catch (error) {
    console.error('[sendContactMessage]', error);
    return err(
      'No se pudo enviar el mensaje. Intentá de nuevo en un momento o escribime directo a mi email.'
    );
  }
}

function renderContactEmailHtml({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject?.trim() || 'Sin asunto');
  // pre-wrap en el div del mensaje conserva los saltos de línea sin
  // necesidad de reemplazarlos por <br/> a mano.
  const safeMessage = escapeHtml(message);

  const time = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date());

  return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px;">
        <div style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 4px;">
          📬 Nuevo mensaje desde tu portfolio
        </div>
        <div style="color: #93c5fd; font-size: 13px;">
          Recibiste un mensaje de ${safeName}
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 28px 32px;">
        <!-- Info del remitente -->
        <table role="presentation" style="width: 100%; margin-bottom: 24px; background-color: #f8faff; border-radius: 8px; border: 1px solid #e0e7ff; padding: 16px;">
          <tbody>
            <tr>
              <td style="vertical-align: middle; width: 56px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb, #60a5fa); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; text-align: center; line-height: 48px;">
                  👤
                </div>
              </td>
              <td style="vertical-align: middle; padding-left: 14px;">
                <div style="color: #1e293b; font-size: 16px; font-weight: 700;">${safeName}</div>
                <div style="color: #2563eb; font-size: 13px; margin-top: 2px;">${safeEmail}</div>
                <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">${time}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Asunto -->
        <div style="margin-bottom: 16px;">
          <div style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
            Asunto
          </div>
          <div style="color: #1e293b; font-size: 15px; font-weight: 600; padding: 10px 14px; background-color: #f1f5f9; border-radius: 6px; border-left: 3px solid #2563eb;">
            ${safeSubject}
          </div>
        </div>

        <!-- Mensaje -->
        <div style="margin-bottom: 24px;">
          <div style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
            Mensaje
          </div>
          <div style="color: #334155; font-size: 15px; line-height: 1.7; padding: 16px; background-color: #f8faff; border-radius: 6px; border: 1px solid #e0e7ff; white-space: pre-wrap;">
            ${safeMessage}
          </div>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 8px;">
          <a href="mailto:${safeEmail}"
            style="display: inline-block; background: linear-gradient(135deg, #2563eb, #60a5fa); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
            Responder a ${safeName}
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; background-color: #f8faff; border-top: 1px solid #e2e8f0; text-align: center;">
        <div style="color: #94a3b8; font-size: 12px;">
          Este mensaje fue enviado desde el formulario de contacto de
          <span style="color: #2563eb; font-weight: 600;">angelberretta.dev</span>
        </div>
      </div>
    </div>
  `;
}

// Evita que el HTML/markup que alguien escriba en el formulario rompa el
// render del email (no es una superficie de XSS contra el sitio, pero un
// mensaje con tags sueltos puede arruinar el mail en el cliente de correo).
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}