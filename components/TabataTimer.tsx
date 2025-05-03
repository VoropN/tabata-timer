'use client';

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

const TabataTimer = () => {
  const [workTime, setWorkTime] = useState<number>(20);
  const [restTime, setRestTime] = useState<number>(10);
  const [roundsCount, setRoundsCount] = useState<number>(8);
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

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Set the 'data-theme' attribute on <html> to toggle between light and dark themes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    } else if (!timerState.isRunning && timerState.seconds !== 0) {
      clearInterval(interval);
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

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        Total Time Remaining: {formatTime(calculateTotalRemainingTime())}
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

      <div className={styles.timerDisplay}>
        {timerState.isWorkPhase ? 'Work' : 'Rest'} Phase:{' '}
        {formatTime(timerState.seconds)}
      </div>

      <div className={styles.roundStatus}>
        Round: {timerState.currentRound}/{roundsCount}
      </div>

      <div className={styles.timerButtonContainer}>
        <button className={styles.timerButton} onClick={handleStartStop}>
          {timerState.isRunning ? 'Stop' : 'Start'}
        </button>
        <button className={styles.timerButton} onClick={handleReset}>
          Reset
        </button>
        <button
          className={styles.timerButton}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default TabataTimer;
