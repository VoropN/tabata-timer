'use client';

import clsx from 'clsx';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './SettingPickerSheet.module.scss';

type Phase = 'work' | 'rest' | 'neutral';

export type SettingPickerSheetProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  phase?: Phase;
};

const ITEM_HEIGHT = 44; // Must match SCSS height

const SettingPickerSheet = ({
  open,
  onClose,
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  phase = 'neutral',
}: SettingPickerSheetProps) => {
  const titleId = useId();
  const doneRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = unit ? `${value} ${unit}` : String(value);

  // Generate dynamic array of values based on bounds
  const stepVal = step > 0 ? step : 1;
  const values: number[] = [];
  for (let i = min; i <= max; i += stepVal) {
    values.push(i);
  }

  const currentIndex = values.indexOf(value);

  // Scroll to active index on open
  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    doneRef.current?.focus();

    // Scroll container to the selected item index
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (container && currentIndex !== -1) {
        container.scrollTop = currentIndex * ITEM_HEIGHT;
      }
    }, 0);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    if (index >= 0 && index < values.length) {
      const newValue = values[index];
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const handleItemClick = (index: number) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth',
      });
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={clsx(styles.sheet, {
          [styles.phaseWork]: phase === 'work',
          [styles.phaseRest]: phase === 'rest',
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {label}
          </h2>
          <p className={styles.currentValue} aria-live="polite">
            {displayValue}
          </p>
        </header>

        <div className={styles.pickerWheelWrap}>
          <div className={styles.selectionIndicator} />
          <div
            ref={containerRef}
            className={styles.pickerWheel}
            onScroll={handleScroll}
          >
            {values.map((val, idx) => (
              <div
                key={val}
                className={clsx(styles.pickerItem, {
                  [styles.active]: idx === currentIndex,
                })}
                onClick={() => handleItemClick(idx)}
              >
                {unit ? `${val} ${unit}` : String(val)}
              </div>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            ref={doneRef}
            type="button"
            className={styles.doneBtn}
            onClick={onClose}
          >
            Done
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default SettingPickerSheet;

