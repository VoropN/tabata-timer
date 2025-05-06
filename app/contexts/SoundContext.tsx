'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import * as Tone from 'tone';
import { getContext } from 'tone';
import { LocalStorageKey, useLocalStorage } from '../hooks';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSignal: (notes: string[], duration?: string, spacing?: number) => void;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}

export const SoundContext = createContext<SoundContextType | undefined>(
  undefined
);

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useLocalStorage({
    key: LocalStorageKey.isMuted,
    value: isMuted,
    setValue: setIsMuted,
    type: 'boolean',
  });

  useEffect(() => {
    synthRef.current = new Tone.PolySynth().toDestination();

    const startAudioContext = async () => {
      await Tone.start();
      console.log('Audio context started');
    };

    window.addEventListener('click', startAudioContext, { once: true });

    return () => {
      window.removeEventListener('click', startAudioContext);
      synthRef.current?.dispose();
    };
  }, []);

  const ensureAudioContext = async () => {
    const context = getContext();
    if (context.state !== 'running') {
      console.log('Resuming suspended AudioContext...');
      await context.resume();
    }
  };

  const playSignal = async (
    notes: string[],
    duration = '16n',
    spacing = 0.1
  ) => {
    const synth = synthRef.current;
    if (!synth || isMuted) return;

    await ensureAudioContext();

    const now = Tone.now();
    notes.forEach((note, i) => {
      if (isMuted) return;
      synth.triggerAttackRelease(note, duration, now + i * spacing);
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider
      value={{ isMuted, toggleMute, setIsMuted, playSignal }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const SIGNAL_MELODIES = {
  start: ['C4', 'E4'],
  change: ['G4', 'E4'],
  stop: ['A3', 'F3'],
  tick: ['C5'],
  error: ['E4', 'C4'],
  success: ['C4', 'D4', 'E4'],
  warning: ['C4', 'C4'],
};
