import { useEffect, useRef, useState } from 'react';

const HERO_BASE_DEFAULT = 24;
const HERO_BASE_MIN = 14;
const HERO_BASE_MAX = 60;
const EPSILON = 0.5;

export const useMaxFitFontSizeToWindow = (hero: HTMLElement | null) => {
  const [fontSize, setFontSize] = useState(HERO_BASE_DEFAULT);

  const rafRef = useRef<number | null>(null);
  const lastSizeRef = useRef(HERO_BASE_DEFAULT);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!hero) return;

    const resizeFont = () => {
      if (isRunningRef.current) return;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!hero) return;

        isRunningRef.current = true;

        try {
          const container = hero.parentElement;

          const containerW =
            container?.clientWidth ?? window.innerWidth;

          const containerH =
            container?.clientHeight ?? window.innerHeight;

          // Create an offscreen clone for measurements.
          const measureEl = hero.cloneNode(true) as HTMLElement;

          const computed = window.getComputedStyle(hero);

          measureEl.style.position = 'fixed';
          measureEl.style.left = '-99999px';
          measureEl.style.top = '0';
          measureEl.style.visibility = 'hidden';
          measureEl.style.pointerEvents = 'none';
          measureEl.style.margin = '0';
          measureEl.style.width = computed.width;
          measureEl.style.maxWidth = computed.maxWidth;
          measureEl.style.minWidth = computed.minWidth;
          measureEl.style.whiteSpace = computed.whiteSpace;
          measureEl.style.fontFamily = computed.fontFamily;
          measureEl.style.fontWeight = computed.fontWeight;
          measureEl.style.fontStyle = computed.fontStyle;
          measureEl.style.letterSpacing = computed.letterSpacing;
          measureEl.style.lineHeight = computed.lineHeight;
          measureEl.style.textTransform = computed.textTransform;
          measureEl.style.wordBreak = computed.wordBreak;
          measureEl.style.overflowWrap = computed.overflowWrap;
          measureEl.style.boxSizing = computed.boxSizing;

          document.body.appendChild(measureEl);

          const fits = (size: number) => {
            measureEl.style.fontSize = `${size}px`;

            return (
              measureEl.scrollWidth <= containerW &&
              measureEl.scrollHeight <= containerH
            );
          };

          let low = HERO_BASE_MIN;
          let high = HERO_BASE_MAX;

          while (high - low > EPSILON) {
            const mid = (low + high) / 2;

            if (fits(mid)) {
              low = mid;
            } else {
              high = mid;
            }
          }

          measureEl.remove();

          const nextSize = Math.max(
            HERO_BASE_MIN,
            Math.min(HERO_BASE_MAX, low)
          );

          // Apply only once to visible element.
          hero.style.fontSize = `${nextSize}px`;

          // Avoid noisy updates.
          if (
            Math.abs(nextSize - lastSizeRef.current) > 1
          ) {
            lastSizeRef.current = nextSize;
            setFontSize(nextSize);
          }
        } finally {
          isRunningRef.current = false;
        }
      });
    };

    resizeFont();

    window.addEventListener('resize', resizeFont, {
      passive: true,
    });

    // Observe parent/container only.
    const observerTarget = hero.parentElement;

    let observer: ResizeObserver | null = null;

    if (observerTarget) {
      observer = new ResizeObserver(() => {
        resizeFont();
      });

      observer.observe(observerTarget);
    }

    return () => {
      window.removeEventListener('resize', resizeFont);

      observer?.disconnect();

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hero]);

  return fontSize;
};