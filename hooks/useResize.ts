'use client';
import { useEffect, useState } from 'react';

export const useMaxFitFontSizeToWindow = (container: HTMLElement | null) => {
  const [fontSize, setFontSize] = useState<number>(20);

  useEffect(() => {
    if (!container) return;
    const resizeFont = () => {
      let size = 1000;
      container.style.fontSize = `${size}px`;

      const fits = () =>
        container.scrollWidth <= window.innerWidth &&
        container.scrollHeight <= window.innerHeight;

      while (!fits() && size > 0) {
        size -= 1;
        container.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    window.addEventListener('resize', resizeFont);
    resizeFont();

    return () => window.removeEventListener('resize', resizeFont);
  }, [container]);

  return fontSize;
};
