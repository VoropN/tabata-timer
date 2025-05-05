import { useEffect, useState } from 'react';

export const useMaxFitFontSizeToWindow = (container: HTMLElement | null) => {
  const [fontSize, setFontSize] = useState<number>(20);

  useEffect(() => {
    if (!container) return;
    const isFit = () =>
      container.scrollWidth >= window.innerWidth ||
      container.scrollHeight >= window.innerHeight;

    const resizeFont = () => {
      let size = Math.floor(
        parseFloat(container.style.fontSize) *
          Math.min(
            container.scrollWidth / window.innerWidth,
            container.scrollHeight / window.innerHeight
          ) *
          10
      );
      container.style.fontSize = `${size}px`;

      while (isFit() && size > 10) {
        size -= 0.5;
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
