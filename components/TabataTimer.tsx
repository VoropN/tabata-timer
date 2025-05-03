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
  roundsCount,
}
const getFromStorage = (key: LocalStorageKey, defaultValue: unknown): any =>
  localStorage.getItem(String(key)) || defaultValue;
const saveToStorage = (key: LocalStorageKey, value: unknown) =>
  localStorage.setItem(String(key), String(value));

const TabataTimer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<number>(20);
  const [workTime, setWorkTime] = useState<number>(0);
  const [restTime, setRestTime] = useState<number>(0);
  const [roundsCount, setRoundsCount] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>({
    workTime,
    restTime,
    roundsCount,
    seconds: workTime,
    isRunning: false,
    isWorkPhase: true,
    rounds: 0,
    currentRound: 1,
  });

  useEffect(() => {
    // Set the 'data-theme' attribute on <html> to toggle between light and dark themes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setTheme(getFromStorage(LocalStorageKey.theme, 'light'));
    setFontSize(Number(getFromStorage(LocalStorageKey.fontSize, 20)));
    setWorkTime(Number(getFromStorage(LocalStorageKey.workTime, 20)));
    setRestTime(Number(getFromStorage(LocalStorageKey.restTime, 10)));
    setRoundsCount(Number(getFromStorage(LocalStorageKey.roundsCount, 8)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    saveToStorage(LocalStorageKey.theme, theme);
    saveToStorage(LocalStorageKey.fontSize, fontSize);
    saveToStorage(LocalStorageKey.workTime, workTime);
    saveToStorage(LocalStorageKey.restTime, restTime);
    saveToStorage(LocalStorageKey.roundsCount, roundsCount);
  }, [theme, fontSize, workTime, restTime, roundsCount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState((prevState) => {
          const newSeconds =
            prevState.seconds === 0
              ? prevState.isWorkPhase
                ? restTime
                : workTime
              : prevState.seconds - 1;

          let newRounds = prevState.rounds;
          let newCurrentRound = prevState.currentRound;

          if (prevState.seconds === 0) {
            const isWorkPhase = !prevState.isWorkPhase;
            if (!isWorkPhase) {
              newRounds += 1;
              newCurrentRound += 1;
              if (newRounds === roundsCount) {
                return {
                  ...prevState,
                  isRunning: false,
                  rounds: 0,
                  currentRound: 1,
                  seconds: 0,
                };
              }
            }

            return {
              ...prevState,
              isWorkPhase: isWorkPhase,
              rounds: newRounds,
              currentRound: newCurrentRound,
              seconds: newSeconds,
            };
          }

          return { ...prevState, seconds: newSeconds };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    timerState.isRunning,
    timerState.seconds,
    timerState.isWorkPhase,
    timerState.rounds,
    timerState.roundsCount,
    workTime,
    restTime,
    roundsCount,
  ]);

  const handleStartStop = () => {
    setTimerState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning,
    }));
  };

  const handleReset = () => {
    setTimerState({
      workTime,
      restTime,
      roundsCount,
      seconds: workTime,
      isRunning: false,
      isWorkPhase: true,
      rounds: 0,
      currentRound: 1,
    });
  };

  // Format time remaining as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  // Calculate the total remaining time for the whole workout (work + rest for remaining rounds)
  const calculateTotalRemainingTime = () => {
    const remainingRounds = roundsCount - timerState.rounds;
    const timePerRound = workTime + restTime;
    const totalTimeRemaining =
      remainingRounds * timePerRound + timerState.seconds;
    return totalTimeRemaining;
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
          {formatTime(calculateTotalRemainingTime())}
        </div>

        <div className={styles.timerControls}>
          <label>Work Time (seconds): </label>
          <input
            className={styles.timerInput}
            type="number"
            value={workTime}
            onChange={(e) => setWorkTime(Number(e.target.value))}
          />
        </div>
        <div className={styles.timerControls}>
          <label>Rest Time (seconds): </label>
          <input
            className={styles.timerInput}
            type="number"
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
          />
        </div>
        <div className={styles.timerControls}>
          <label>Rounds: </label>
          <input
            className={styles.timerInput}
            type="number"
            value={roundsCount}
            onChange={(e) => setRoundsCount(Number(e.target.value))}
          />
        </div>

        <div className={styles.phaseName}>
          {timerState.isWorkPhase ? <>Work Phase</> : <>Rest Phase</>}
        </div>
        <div className={styles.timerDisplay}>
          <FontAwesomeIcon
            className={styles.timerDisplayIcon}
            icon={timerState.isWorkPhase ? faRunning : faHand}
          />
          <span>{formatTime(timerState.seconds)}</span>
        </div>

        <div className={styles.roundStatus}>
          <span>Round: </span>
          <span className={styles.roundStatusNumber}>
            {timerState.currentRound}/{roundsCount}
          </span>
        </div>

        <div className={styles.timerButtonContainer}>
          <button className={styles.timerButton} onClick={handleStartStop}>
            {timerState.isRunning ? 'Stop' : 'Start'}
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
