'use client';

import {
  faHand,
  faLightbulb,
  faMoon,
  faPause,
  faPlay,
  faRunning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import ChangeSize from '../ChangeSize';
import styles from './TabataTimer.module.scss';

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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const increaseFontSizeUntilFit = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (
        container.clientWidth < windowWidth - 10 && // Container width less than 90% of window width
        container.clientHeight < windowHeight - 10
      ) {
        setTimeout(() => {
          setFontSize(fontSize + 0.1);
        }, 50);
      }

      if (
        container.clientWidth >= windowWidth ||
        container.clientHeight >= windowHeight
      ) {
        setTimeout(() => {
          setFontSize(fontSize - 0.1);
        }, 50);
      }
    };

    increaseFontSizeUntilFit();

    // Listen for window resize event
    const handleResize = () => {
      increaseFontSizeUntilFit(); // Recalculate font size on window resize
    };

    increaseFontSizeUntilFit();
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fontSize, containerRef.current]);

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
      <div
        ref={containerRef}
        className={styles.timerContainer}
        style={{ fontSize }}
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
          <FontAwesomeIcon
            className={clsx(styles.timerDisplayIcon, {
              [styles.stop]: !isWorkPhase,
            })}
            icon={isWorkPhase ? faRunning : faHand}
          />
          <span>
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

        <div className={styles.timerButtonContainer}>
          <button
            className={styles.iconButton}
            onClick={() => setIsRunning(!isRunning)}
          >
            <FontAwesomeIcon
              className={clsx(styles.icon, { [styles.play]: !isRunning })}
              icon={isRunning ? faPause : faPlay}
              color="grey"
            />
          </button>
          <button className={styles.timerButton} onClick={handleReset}>
            Reset
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <FontAwesomeIcon
              className={clsx(styles.icon)}
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
