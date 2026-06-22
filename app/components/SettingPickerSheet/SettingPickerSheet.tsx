'use client';

import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';
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

// Must exactly match the height set in SettingPickerSheet.module.scss .pickerItem
const ITEM_HEIGHT = 52;
// Number of items visible at once (determines padding)
const VISIBLE_ITEMS = 5;
// Top/bottom padding so first and last items can reach the center
const WHEEL_PADDING = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2; // = 104px

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
  const isProgrammaticScrollRef = useRef(false);

  const stepVal = step > 0 ? step : 1;
  const values: number[] = [];
  for (let i = min; i <= max; i += stepVal) {
    values.push(i);
  }

  const clampedValue = values.includes(value) ? value : values[0];
  const [localValue, setLocalValue] = useState(clampedValue);

  // Scroll to a given index without triggering the scroll handler
  const scrollToIndex = (idx: number, behavior: ScrollBehavior = 'auto') => {
    const container = containerRef.current;
    if (!container) return;
    isProgrammaticScrollRef.current = true;
    container.scrollTo({ top: idx * ITEM_HEIGHT, behavior });
    // Reset flag after scroll settles
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, behavior === 'smooth' ? 400 : 50);
  };

  // Sync local state and scroll position when picker opens
  useEffect(() => {
    if (!open) return;
    const idx = values.indexOf(clampedValue);
    setLocalValue(clampedValue);
    doneRef.current?.focus({ preventScroll: true });
    // Defer scroll until the DOM is painted
    const timer = setTimeout(() => scrollToIndex(idx >= 0 ? idx : 0), 30);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCommitClose = (committedValue = localValue) => {
    onChange(committedValue);
    onClose();
  };

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCommitClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, localValue]);

  if (!open || typeof document === 'undefined') return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScrollRef.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, values.length - 1));
    const newValue = values[clamped];
    if (newValue !== undefined && newValue !== localValue) {
      setLocalValue(newValue);
    }
  };

  const handleItemClick = (idx: number) => {
    const newValue = values[idx];
    if (newValue === undefined) return;
    setLocalValue(newValue);
    scrollToIndex(idx, 'smooth');
  };

  const currentLocalIndex = values.indexOf(localValue);
  const displayValue = unit ? `${localValue} ${unit}` : String(localValue);

  return createPortal(
    <div className={styles.overlay} onClick={() => handleCommitClose()}>
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
            style={{ '--wheel-padding': `${WHEEL_PADDING}px` } as React.CSSProperties}
          >
            {values.map((val, idx) => (
              <div
                key={val}
                className={clsx(styles.pickerItem, {
                  [styles.active]: idx === currentLocalIndex,
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
            onClick={() => handleCommitClose()}
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
