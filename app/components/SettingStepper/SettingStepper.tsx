'use client';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useRef } from 'react';
import styles from './SettingStepper.module.scss';

type Phase = 'work' | 'rest' | 'neutral';

export type SettingStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  phase?: Phase;
  disabled?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SettingStepper = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  phase = 'neutral',
  disabled = false,
}: SettingStepperProps) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayValue = unit ? `${value} ${unit}` : String(value);

  const adjust = (delta: number) => {
    onChange(clamp(value + delta, min, max));
  };

  const startRepeat = (delta: number) => {
    adjust(delta);
    timerRef.current = setInterval(() => adjust(delta), 100);
  };

  const stopRepeat = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const bindPointer = (delta: number) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      startRepeat(delta);
    },
    onPointerUp: stopRepeat,
    onPointerLeave: stopRepeat,
    onPointerCancel: stopRepeat,
  });

  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div
      className={clsx(styles.row, {
        [styles.phaseWork]: phase === 'work',
        [styles.phaseRest]: phase === 'rest',
      })}
      data-phase={phase}
    >
      <span className={styles.label}>{label}</span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.stepBtn}
          disabled={disabled || !canDecrement}
          aria-label={`Decrease ${label}`}
          style={{ touchAction: 'none' }}
          {...bindPointer(-step)}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className={styles.value} aria-live="polite">
          {displayValue}
        </span>
        <button
          type="button"
          className={styles.stepBtn}
          disabled={disabled || !canIncrement}
          aria-label={`Increase ${label}`}
          style={{ touchAction: 'none' }}
          {...bindPointer(step)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};

export default SettingStepper;
