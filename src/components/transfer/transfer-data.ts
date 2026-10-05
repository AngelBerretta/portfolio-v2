// transfer-data.ts — datos de contacto editables en un solo lugar.
// Los links a GitHub / LinkedIn se reusan de hero/hero-data.ts (SOCIAL_LINKS).

export const CONTACT_EMAIL = 'angelberretta.dev@gmail.com';

// Es un dato público en el HTML. Si no querés mostrar el teléfono, borrá esta
// constante y su fila en TransferInfo.tsx.
export const CONTACT_PHONE = { label: '+54 9 2346 694273', href: 'tel:+5492346694273' };

export const CONTACT_LOCATION = 'Chivilcoy, Buenos Aires, Argentina';

/** Se usa en el mensaje de éxito del formulario y en la tarjeta de horario. */
export const RESPONSE_TIME = 'menos de 24 h';

export const SCHEDULE = [
  { days: 'Lun – Vie', hours: '9:00 – 21:00' },
  { days: 'Sáb – Dom', hours: '10:00 – 18:00' },
] as const;

export const SCHEDULE_TIMEZONE = 'Hora de Argentina (GMT-3)';
