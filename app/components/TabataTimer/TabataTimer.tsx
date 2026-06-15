'use client';

import { useWakeLock } from '@/app/hooks';
import { LocalStorageKey, useLocalStorage } from '@/app/hooks/useLocalStorage';

import { useSound } from '@/app/contexts';
import { useLoading } from '@/app/hooks/useLoading';
import { useMaxFitFontSizeToWindow } from '@/app/hooks/useResize';
import { SIGNAL_MELODIES } from '@/app/lib/signals';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import PresetsSheet from '../PresetsSheet';
import SettingStepper from '../SettingStepper';
import StopButton from '../Timer';
import styles from './TabataTimer.module.scss';
import { PRESETS, type Preset } from '@/app/lib/presets';

const TabataTimer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [workTime, setWorkTime] = useState<number>(20);
  const [restTime, setRestTime] = useState<number>(10);
  const [rounds, setRounds] = useState<number>(8);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset>();
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const { playSignal } = useSound();
  const { isLoading } = useLoading();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fontSize = useMaxFitFontSizeToWindow(hero);

  const oneRound = workTime + restTime;
  const maxTime = oneRound > 0 ? oneRound * rounds - restTime : 0;

  const currentRound =
    oneRound > 0
      ? Math.min(
          rounds,
          Math.floor((currentTime + restTime) / oneRound) + 1
        )
      : 1;
  const isWorkPhase =
    oneRound > 0 &&
    currentRound * oneRound - currentTime - restTime <= workTime;
  const roundTime = isWorkPhase
    ? Math.max(workTime - (currentTime % oneRound), 0)
    : Math.max(restTime - ((currentTime % oneRound) - workTime), 0);
  const phaseDuration = isWorkPhase ? workTime : restTime;
  const roundTimeProgress =
    phaseDuration > 0 ? (roundTime / phaseDuration) * 100 : 0;

  const handleReset = useCallback(() => {
    setCurrentTime(0);
    setIsRunning(false);
    playSignal(SIGNAL_MELODIES.stop);
  }, [playSignal]);

  const applyPreset = (preset: Preset) => {
    setWorkTime(preset.workTime);
    setRestTime(preset.restTime);
    setRounds(preset.rounds);
    setSelectedPreset(preset);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  const timeToShow = isWorkPhase
    ? Math.max(workTime - (currentTime % oneRound), 0)
    : Math.max(restTime - ((currentTime % oneRound) - workTime), 0);

  useWakeLock(isRunning);

  useEffect(() => {
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
  useLocalStorage({
    key: LocalStorageKey.preset,
    value: selectedPreset,
    setValue: setSelectedPreset,
    type: 'object'
  });

  // Synchronize preset selection with current custom timings
  useEffect(() => {
    if (isLoading) return;

    const matchingPreset = PRESETS.find(
      (p) =>
        p.workTime === workTime &&
        p.restTime === restTime &&
        p.rounds === rounds
    );
    if (selectedPreset?.name !== matchingPreset?.name) {
      setSelectedPreset(matchingPreset);
    }
  }, [workTime, restTime, rounds, isLoading, selectedPreset]);

  useEffect(() => {
    if (isLoading || !isRunning) return;
    if (timeToShow === 1) {
      playSignal(SIGNAL_MELODIES.change);
    } else if (timeToShow === 2) {
      playSignal(SIGNAL_MELODIES.change2);
    } else if (timeToShow === 3) {
      playSignal(SIGNAL_MELODIES.change3);
    }
  }, [timeToShow, isLoading, isRunning, playSignal]);

  useEffect(() => {
    if (!isRunning || maxTime <= 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= maxTime) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          playSignal(SIGNAL_MELODIES.stop);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [maxTime, isRunning, playSignal]);

  const handlePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
      playSignal(SIGNAL_MELODIES.stop);
    } else {
      setIsRunning(true);
      playSignal(SIGNAL_MELODIES.start);
    }
  };

  if (isLoading) return null;

  return (
    <div
      className={clsx(styles.timerContainer, {
        [styles.isRunning]: isRunning,
        [styles.isWorkPhase]: isWorkPhase,
      })}
    >
      <div
        ref={(ref) => setHero(ref)}
        className={styles.timerHero}
        style={{
          fontSize,
          ['--progress' as string]: `${roundTimeProgress}%`,
        }}
      >
        <div className={styles.phaseName}>
          {isWorkPhase ? <>Work Phase</> : <>Rest Phase</>}
        </div>
        <div className={styles.timerDisplay}>
          <FontAwesomeIcon
            className={clsx(styles.timerDisplayIcon, styles.mask, {
              [styles.stop]: !isWorkPhase,
            })}
            icon={isWorkPhase ? faRunning : faHand}
          />
          <FontAwesomeIcon
            className={clsx(styles.timerDisplayIcon, {
              [styles.stop]: !isWorkPhase,
            })}
            icon={isWorkPhase ? faRunning : faHand}
          />
          <span className={clsx(styles.workTime)}>{formatTime(timeToShow)}</span>
        </div>
        <div className={styles.roundStatus}>
          <span>Round: </span>
          <span className={styles.roundStatusNumber}>
            {currentRound}/{rounds}
          </span>
        </div>
        <div className={styles.fullTime}>
          {formatTime(Math.max(maxTime - currentTime, 0))}
        </div>
      </div>

      <div className={styles.timerControls}>
        {selectedPreset ? (
          <button
            type="button"
            className={clsx(styles.preset, styles.presetSelected)}
            onClick={() => setPresetsOpen(true)}
            disabled={isRunning}
          >
            <span className={styles.presetContent}>
              <span className={styles.presetEmoji}>{selectedPreset.emoji}</span>
              <span className={styles.presetName}>{selectedPreset.name}</span>
            </span>
            <span className={styles.presetBadge}>Change</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.preset}
            onClick={() => setPresetsOpen(true)}
            disabled={isRunning}
          >
            🏋️ Preset Workouts
          </button>
        )}
        <PresetsSheet
          open={presetsOpen}
          onClose={() => setPresetsOpen(false)}
          onSelect={applyPreset}
        />
        <SettingStepper
          label="Work"
          value={workTime}
          onChange={setWorkTime}
          min={5}
          max={600}
          step={5}
          unit="sec"
          phase="work"
          disabled={isRunning}
        />
        <SettingStepper
          label="Rest"
          value={restTime}
          onChange={setRestTime}
          min={0}
          max={300}
          step={5}
          unit="sec"
          phase="rest"
          disabled={isRunning}
        />
        <SettingStepper
          label="Rounds"
          value={rounds}
          onChange={setRounds}
          min={1}
          max={100}
          step={1}
          disabled={isRunning}
        />
      </div>

      <div className={styles.actionButtons}>
        <Button onClick={handleReset} icon={faClockRotateLeft} />
        <Button
          type="icon"
          className={clsx(styles.iconButton, {
            [styles.playPauseRunning]: isRunning,
          })}
          onClick={handlePlayPause}
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
  );
};

export default TabataTimer;
