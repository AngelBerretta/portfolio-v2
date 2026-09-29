// Tipo de retorno estándar para todos los Server Actions
// Compatible con useActionState de React

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<string, string[]>>;
    };

// Helper para construir resultados de éxito
export function ok<T>(data?: T): ActionResult<T> {
  return { success: true, data };
}

// Helper para construir resultados de error
export function err(
  message: string,
  fieldErrors?: Partial<Record<string, string[]>>
): ActionResult<never> {
  return { success: false, error: message, fieldErrors };
}