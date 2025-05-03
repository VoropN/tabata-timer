'use client';

import {
  faHand,
  faLightbulb,
  faMoon,
  faRunning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './TabataTimer.module.scss';

interface TimerState {
  workTime: number;
  restTime: number;
  roundsCount: number;
  seconds: number;
  isRunning: boolean;
  isWorkPhase: boolean;
  rounds: number;
  currentRound: number;
}

enum LocalStorageKey {
  theme,
  fontSize,
  workTime,
  restTime,
  rounds,
}
const getFromStorage = (key: LocalStorageKey, defaultValue: unknown): any =>
  localStorage.getItem(String(key)) || defaultValue;
const saveToStorage = (key: LocalStorageKey, value: unknown) =>
  localStorage.setItem(String(key), String(value));

const TabataTimer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<number>(20);
  const [workTime, setWorkTime] = useState<number>(20); // sensible defaults
  const [restTime, setRestTime] = useState<number>(10);
  const [rounds, setRounds] = useState<number>(8);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const oneRound = workTime + restTime;
  const maxTime = oneRound > 0 ? oneRound * rounds - restTime : 0;

  const currentRound = Math.min(
    rounds,
    Math.floor((currentTime + restTime) / oneRound) + 1
  );
  const isWorkPhase =
    currentRound * oneRound - currentTime - restTime <= workTime;

  useEffect(() => {
    // Set the 'data-theme' attribute on <html> to toggle between light and dark themes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setTheme(getFromStorage(LocalStorageKey.theme, 'light'));
    setFontSize(Number(getFromStorage(LocalStorageKey.fontSize, 20)));
    setWorkTime(Number(getFromStorage(LocalStorageKey.workTime, 20)));
    setRestTime(Number(getFromStorage(LocalStorageKey.restTime, 10)));
    setRounds(Number(getFromStorage(LocalStorageKey.rounds, 8)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    saveToStorage(LocalStorageKey.theme, theme);
    saveToStorage(LocalStorageKey.fontSize, fontSize);

    saveToStorage(LocalStorageKey.workTime, workTime);
    saveToStorage(LocalStorageKey.restTime, restTime);
    saveToStorage(LocalStorageKey.rounds, rounds);
  }, [theme, fontSize, workTime, restTime, rounds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= maxTime) {
          clearInterval(interval);
          setCurrentTime(0);
          setIsRunning(false);
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxTime, isRunning]);

  const handleReset = () => {
    setCurrentTime(0);
    setIsRunning(false);
  };

  // Format time remaining as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <div className={styles.rangeContainer}>
        <input
          type="range"
          value={fontSize}
          min={10}
          onChange={({ target }) => setFontSize(+target.value)}
          step=".1"
          className={clsx(theme, styles.range)}
        />
      </div>
      <div className={styles.timerContainer} style={{ fontSize }}>
        <div className={styles.timerHeader}>
          {formatTime(maxTime - currentTime)}
        </div>

        <div className={styles.timerControls}>
          <label>Work Time (seconds): </label>
          <input
            className={styles.timerInput}
            type="number"
            min={0}
            value={workTime}
            onChange={(e) => setWorkTime(Number(e.target.value))}
          />
        </div>
        <div className={styles.timerControls}>
          <label>Rest Time (seconds): </label>
          <input
            className={styles.timerInput}
            type="number"
            min={0}
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
          />
        </div>
        <div className={styles.timerControls}>
          <label>Rounds: </label>
          <input
            className={styles.timerInput}
            type="number"
            min={1}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
          />
        </div>

        <div className={styles.phaseName}>
          {isWorkPhase ? <>Work Phase</> : <>Rest Phase</>}
        </div>
        <div className={styles.timerDisplay}>
          <FontAwesomeIcon
            className={styles.timerDisplayIcon}
            icon={isWorkPhase ? faRunning : faHand}
          />
          <span>{formatTime(currentTime)}</span>
        </div>

        <div className={styles.roundStatus}>
          <span>Round: </span>
          <span className={styles.roundStatusNumber}>
            {currentRound}/{rounds}
          </span>
        </div>

        <div className={styles.timerButtonContainer}>
          <button
            className={styles.timerButton}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button className={styles.timerButton} onClick={handleReset}>
            Reset
          </button>
          <button
            className={styles.themeButton}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <FontAwesomeIcon
              className={styles.theme}
              icon={theme === 'light' ? faLightbulb : faMoon}
              color="grey"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default TabataTimer;
