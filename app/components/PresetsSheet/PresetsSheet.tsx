'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  PRESETS,
  type Preset,
} from '@/app/lib/presets';
import styles from './PresetsSheet.module.scss';
import PresetItem from './PresetItem';

export type PresetsSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (preset: Preset) => void;
};

const PresetsSheet = ({ open, onClose, onSelect }: PresetsSheetProps) => {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

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
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const handleSelect = (preset: Preset) => {
    onSelect(preset);
    onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Preset Workouts
          </h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close presets"
          >
            ✕
          </button>
        </header>

        <ul className={styles.list} role="list">
          {PRESETS.map((preset) => (
              <li key={preset.name}>
                <PresetItem preset={preset} handleSelect={handleSelect} />
              </li>
            ))}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default PresetsSheet;
