'use client';

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { sendContactMessage } from '@/actions/contact';
import type { ActionResult } from '@/lib/action-types';
import { gsap, useGSAP, MOTION_OK } from '@/animations/gsap.config';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';
import { Button } from '@/components/shared/Button';
import { cn } from '@/utils/cn';
import { RESPONSE_TIME } from './transfer-data';

type FieldName = 'name' | 'email' | 'subject' | 'message';

const EMPTY: Record<FieldName, string> = { name: '', email: '', subject: '', message: '' };
const SUCCESS_VISIBLE_MS = 6000;

// border-border-strong (y no border-border): el contorno de un control de
// formulario necesita ≥ 3:1 contra el fondo (WCAG 1.4.11). border-border es
// ~1.4:1 en el kit away.
const inputClass =
  'w-full rounded-lg border border-border-strong bg-bg-secondary px-4 py-3 text-sm text-text-primary ' +
  'placeholder:text-text-muted transition-colors duration-200 focus-visible:border-accent';

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {optional && <span className="font-normal text-text-muted"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-loss">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Formulario de contacto. Reusa la Server Action `sendContactMessage` sin
 * cambios (Resend, rate limit y honeypot viven ahí).
 *
 * Los campos son controlados a propósito: React 19 resetea los formularios
 * no controlados cuando termina la action, incluso si falló, y el visitante
 * perdería el mensaje que acaba de escribir ante un error o un rate limit.
 * Solo se vacían cuando el envío fue exitoso.
 */
export function TransferForm() {
  const uid = useId();
  const cardRef = useRevealOnScroll<HTMLDivElement>({ direction: 'right', delay: 0.1 });
  const statusRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState(EMPTY);

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (prev, formData) => {
      const result = await sendContactMessage(prev, formData);
      if (result.success) setValues(EMPTY);
      return result;
    },
    null
  );

  // El aviso de éxito se esconde solo; los errores se quedan hasta el próximo envío.
  const [dismissed, setDismissed] = useState<ActionResult | null>(null);
  useEffect(() => {
    if (!state?.success) return;
    const timeout = setTimeout(() => setDismissed(state), SUCCESS_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [state]);

  const showSuccess = state?.success === true && dismissed !== state;
  const failure = state?.success === false ? state : null;
  const fieldErrors = failure?.fieldErrors;

  // Micro-animación de éxito: el badge "salta", el tilde se dibuja y el texto
  // entra. Con prefers-reduced-motion no corre y todo queda en su estado final.
  useGSAP(
    () => {
      if (!showSuccess) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(
            '[data-success-badge]',
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)', clearProps: 'transform,opacity' }
          )
          .fromTo(
            '[data-success-check]',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' },
            '-=0.15'
          )
          .fromTo(
            '[data-success-text]',
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' },
            '-=0.25'
          );
      });

      return () => mm.revert();
    },
    { scope: statusRef, dependencies: [showSuccess], revertOnUpdate: true }
  );

  const fieldProps = (name: FieldName) => {
    const hasError = !!fieldErrors?.[name]?.length;
    return {
      id: `${uid}-${name}`,
      name,
      value: values[name],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((v) => ({ ...v, [name]: e.target.value })),
      'aria-invalid': hasError || undefined,
      'aria-describedby': hasError ? `${uid}-${name}-error` : undefined,
      className: cn(inputClass, hasError && 'border-loss'),
    };
  };

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-border bg-bg-card p-6 sm:p-8"
    >
      <h3 className="mb-6 font-display text-xl font-bold text-text-primary">Enviame un mensaje</h3>

      <form action={formAction} aria-busy={isPending} className="relative space-y-5">
        {/* Honeypot: un humano nunca lo completa; la action lo descarta en silencio. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={`${uid}-name`} label="Nombre" error={fieldErrors?.name?.[0]}>
            <input
              {...fieldProps('name')}
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="Tu nombre"
            />
          </Field>

          <Field id={`${uid}-email`} label="Email" error={fieldErrors?.email?.[0]}>
            <input
              {...fieldProps('email')}
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </Field>
        </div>

        <Field id={`${uid}-subject`} label="Asunto" optional error={fieldErrors?.subject?.[0]}>
          <input
            {...fieldProps('subject')}
            type="text"
            maxLength={150}
            placeholder="¿De qué se trata?"
          />
        </Field>

        <Field id={`${uid}-message`} label="Mensaje" error={fieldErrors?.message?.[0]}>
          <textarea
            {...fieldProps('message')}
            required
            rows={6}
            maxLength={2000}
            placeholder="Contame sobre tu proyecto o propuesta..."
            className={cn(fieldProps('message').className, 'resize-none')}
          />
        </Field>

        {failure && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {failure.error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Enviar mensaje
            </>
          )}
        </Button>

        {/* Siempre montado para que los lectores de pantalla anuncien el cambio. */}
        <div ref={statusRef} role="status" aria-live="polite">
          {showSuccess && (
            <div className="flex items-center gap-3 rounded-lg border border-win/30 bg-win/10 px-4 py-3 text-sm text-win">
              <span
                data-success-badge
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-win text-text-inverse"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* pathLength=1 normaliza el trazo para animar strokeDashoffset de 1 a 0 */}
                  <path
                    data-success-check
                    d="M5 12.5l4.5 4.5L19 7.5"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={0}
                  />
                </svg>
              </span>
              <p data-success-text>
                <span className="font-semibold">Mensaje enviado.</span> Te respondo en {RESPONSE_TIME}.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-text-muted">Tu mensaje llega directo a mi correo.</p>
      </form>
    </div>
  );
}