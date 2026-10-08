// Única fuente de los ids de sección. Deben coincidir con el id de cada
// <section> del home y con nav-items.ts.
export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];