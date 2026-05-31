'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  calcTotalDuration,
  formatDuration,
  PRESETS,
  type Preset,
} from '@/app/lib/presets';
import styles from './PresetsSheet.module.scss';

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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
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
          {PRESETS.map((preset) => {
            const total = calcTotalDuration(preset);
            return (
              <li key={preset.name}>
                <button
                  type="button"
                  className={styles.card}
                  onClick={() => handleSelect(preset)}
                >
                  <span className={styles.cardEmoji} aria-hidden="true">
                    {preset.emoji}
                  </span>
                  <span className={styles.cardBody}>
                    <span className={styles.cardName}>{preset.name}</span>
                    <span className={styles.cardDesc}>{preset.description}</span>
                    <span className={styles.cardTags}>
                      <span className={styles.tagWork}>
                        Work {formatDuration(preset.workTime)}
                      </span>
                      <span className={styles.tagRest}>
                        Rest {formatDuration(preset.restTime)}
                      </span>
                      <span className={styles.tagRounds}>
                        {preset.rounds} rounds
                      </span>
                    </span>
                  </span>
                  <span className={styles.cardTotal}>
                    {formatDuration(total)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default PresetsSheet;
