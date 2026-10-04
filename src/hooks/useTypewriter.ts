'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Escribe y borra `words` en bucle. Cambios respecto a la versión anterior:
 * - Con `prefers-reduced-motion` no anima: devuelve la primera palabra fija.
 * - Si `words` está vacío no rompe.
 * - Acepta `readonly string[]`.
 *
 * `words` debe tener identidad estable (constante de módulo o useMemo):
 * si pasás un array literal nuevo en cada render, el efecto se reinicia.
 */
export function useTypewriter(words: readonly string[], speed = 80, pause = 2000) {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced || words.length === 0) return;

    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, speed / 2.5);
    } else {
      // Transición inmediata a la siguiente palabra. La envolvemos en un
      // setTimeout(0) para no llamar setState de forma sincrónica dentro
      // del efecto — el comportamiento visual es idéntico.
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause, reduced]);

  return reduced ? (words[0] ?? '') : text;
}