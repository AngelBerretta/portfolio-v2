import { useState, useEffect } from 'react'

const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const
export type SectionId = (typeof SECTIONS)[number]

// Offset de referencia: usamos "un poco debajo del navbar fijo" como línea
// de corte, en vez del centro exacto de la pantalla. Así la sección se
// marca activa apenas empieza a aparecer bajo el navbar.
const OFFSET = 100

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    let rafId: number | null = null

    const checkActiveSection = () => {
      rafId = null

      // Si llegamos al final de la página, forzamos "contact" — evita que
      // quede pegado en la sección anterior si #contact es más corto que
      // el resto y su "top" nunca llega a cruzar el OFFSET.
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

      if (scrolledToBottom) {
        setActiveSection('contact')
        return
      }

      // Recorremos de abajo hacia arriba: la primera sección cuyo borde
      // superior ya cruzó el offset es la sección activa actual.
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i])
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= OFFSET) {
          setActiveSection(SECTIONS[i])
          return
        }
      }

      setActiveSection('hero')
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(checkActiveSection)
      }
    }

    checkActiveSection() // estado correcto si se recarga con scroll ya hecho
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return activeSection
}