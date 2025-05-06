'use client';

import { SIGNAL_MELODIES, useWakeLock } from '@/app/hooks';
import { LocalStorageKey, useLocalStorage } from '@/app/hooks/useLocalStorage';

import { useSound } from '@/app/contexts';
import { useLoading } from '@/app/hooks/useLoading';
import { useMaxFitFontSizeToWindow } from '@/app/hooks/useResize';
import {
  faClockRotateLeft,
  faHand,
  faLightbulb,
  faMoon,
  faPause,
  faPlay,
  faRunning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import ChangeSize from '../ChangeSize';
import StopButton from '../Timer';
import styles from './TabataTimer.module.scss';

const TabataTimer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [workTime, setWorkTime] = useState<number>(20); // sensible defaults
  const [restTime, setRestTime] = useState<number>(10);
  const [rounds, setRounds] = useState<number>(8);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { playSignal } = useSound();
  const { isLoading } = useLoading();

  const fontSize = useMaxFitFontSizeToWindow(container);

  const oneRound = workTime + restTime;
  const maxTime = oneRound > 0 ? oneRound * rounds - restTime : 0;

  const currentRound = Math.min(
    rounds,
    Math.floor((currentTime + restTime) / oneRound) + 1
  );
  const isWorkPhase =
    currentRound * oneRound - currentTime - restTime <= workTime;

  const handleReset = () => {
    setCurrentTime(0);
    setIsRunning(false);
    playSignal(SIGNAL_MELODIES.stop);
  };
  // Format time remaining as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  useWakeLock(isRunning);

  useEffect(() => {
    // Set the 'data-theme' attribute on <html> to toggle between light and dark themes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useLocalStorage({
    key: LocalStorageKey.theme,
    value: theme,
    setValue: setTheme,
  });
  useLocalStorage({
    key: LocalStorageKey.workTime,
    value: workTime,
    setValue: setWorkTime,
    type: 'number',
  });
  useLocalStorage({
    key: LocalStorageKey.restTime,
    value: restTime,
    setValue: setRestTime,
    type: 'number',
  });
  useLocalStorage({
    key: LocalStorageKey.rounds,
    value: rounds,
    setValue: setRounds,
    type: 'number',
  });

  useEffect(() => {
    if (!isRunning) return;
    playSignal(SIGNAL_MELODIES.change);
  }, [isWorkPhase, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= maxTime) {
          clearInterval(interval);
          handleReset();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxTime, isRunning]);

  if (isLoading) return <></>;

  return (
    <>
      <div
        ref={(ref) => setContainer(ref)}
        style={{ fontSize }}
        className={styles.timerContainer}
      >
        <div className={styles.timerHeader}>
          {formatTime(maxTime - currentTime)}
        </div>

        <div className={styles.timerControls}>
          <label>Work Time (sec): </label>
          <ChangeSize
            increaseSize={() => setWorkTime((prev) => prev + 1)}
            decreaseSize={() =>
              setWorkTime((prev) => (prev > 1 ? prev - 1 : 1))
            }
          >
            <span className={styles.timerInput}>{workTime}</span>
          </ChangeSize>
          <label>Rest Time (sec): </label>
          <ChangeSize
            increaseSize={() => setRestTime((prev) => prev + 1)}
            decreaseSize={() =>
              setRestTime((prev) => (prev > 0 ? prev - 1 : 0))
            }
          >
            <span className={styles.timerInput}>{restTime}</span>
          </ChangeSize>
          <label>Rounds: </label>
          <ChangeSize
            increaseSize={() => setRounds((prev) => prev + 1)}
            decreaseSize={() => setRounds((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            <span className={styles.timerInput}>{rounds}</span>
          </ChangeSize>
        </div>

        <div className={styles.phaseName}>
          {isWorkPhase ? <>Work Phase</> : <>Rest Phase</>}
        </div>
        <div className={styles.timerDisplay}>
          {isRunning ? (
            <FontAwesomeIcon
              className={clsx(styles.timerDisplayIcon, {
                [styles.stop]: !isWorkPhase,
              })}
              icon={isWorkPhase ? faRunning : faHand}
            />
          ) : (
            <span />
          )}
          <span className={styles.workTime}>
            {formatTime(
              isWorkPhase
                ? Math.max(workTime - (currentTime % oneRound), 0) // Work phase remaining time
                : Math.max(restTime - ((currentTime % oneRound) - workTime), 0) // Rest phase remaining time
            )}
          </span>
        </div>

        <div className={styles.roundStatus}>
          <span>Round: </span>
          <span className={styles.roundStatusNumber}>
            {currentRound}/{rounds}
          </span>
        </div>

        <div className={styles.actionButtons}>
          <Button onClick={handleReset} icon={faClockRotateLeft} />
          <Button
            type="icon"
            className={styles.iconButton}
            onClick={() => {
              setIsRunning(!isRunning);
              playSignal(SIGNAL_MELODIES.start);
            }}
          >
            {isRunning ? (
              <StopButton time={maxTime} currentTime={currentTime}>
                <FontAwesomeIcon className={styles.icon} icon={faPause} />
              </StopButton>
            ) : (
              <FontAwesomeIcon
                className={clsx(styles.icon, styles.stop)}
                icon={faPlay}
              />
            )}
          </Button>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            icon={theme === 'light' ? faLightbulb : faMoon}
          />
        </div>
      </div>
    </>
  );
};

export default TabataTimer;
