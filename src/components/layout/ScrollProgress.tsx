'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let max = 0;

    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const update = () => {
      raf = 0;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

    measure();
    update();

    const ro = new ResizeObserver(() => { measure(); schedule(); });
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', schedule, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5">
      <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}