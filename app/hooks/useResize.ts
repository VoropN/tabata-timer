import { useCallback, useEffect, useState } from 'react';

const HERO_BASE_DEFAULT = 20;
const HERO_BASE_MIN = 16;
const HERO_BASE_MAX = 28;

type FitDeps = {
  isRunning: boolean;
  workTime: number;
  restTime: number;
  rounds: number;
};

export const useMaxFitFontSizeToWindow = (
  hero: HTMLElement | null,
  deps?: FitDeps
) => {
  const [fontSize, setFontSize] = useState<number>(HERO_BASE_DEFAULT);

  const resizeFont = useCallback(() => {
    if (!hero) return;

    const isOverflow = () =>
      hero.scrollWidth > window.innerWidth ||
      hero.scrollHeight > window.innerHeight;

    let size = HERO_BASE_DEFAULT;

    hero.style.fontSize = `${size}px`;

    if (isOverflow()) {
      size = Math.floor(
        HERO_BASE_DEFAULT *
          Math.min(
            window.innerWidth / hero.scrollWidth,
            window.innerHeight / hero.scrollHeight
          ) *
          0.95
      );
      hero.style.fontSize = `${size}px`;
    }

    while (isOverflow() && size > HERO_BASE_MIN) {
      size -= 0.5;
      hero.style.fontSize = `${size}px`;
    }

    size = Math.min(Math.max(size, HERO_BASE_MIN), HERO_BASE_MAX);
    hero.style.fontSize = `${size}px`;
    setFontSize(size);
  }, [hero]);

  useEffect(() => {
    if (!hero) return;

    resizeFont();

    window.addEventListener('resize', resizeFont);

    const observer = new ResizeObserver(() => resizeFont());
    observer.observe(hero);

    return () => {
      window.removeEventListener('resize', resizeFont);
      observer.disconnect();
    };
  }, [
    hero,
    resizeFont,
    deps?.isRunning,
    deps?.workTime,
    deps?.restTime,
    deps?.rounds,
  ]);

  return fontSize;
};
