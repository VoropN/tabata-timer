'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
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
  playSignal: (
    notes: readonly string[],
    duration?: string,
    spacing?: number
  ) => void;
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
  const isMutedRef = useRef(isMuted);

  isMutedRef.current = isMuted;

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
    };

    window.addEventListener('click', startAudioContext, { once: true });

    return () => {
      window.removeEventListener('click', startAudioContext);
      synthRef.current?.dispose();
    };
  }, []);

  const playSignal = useCallback(
    async (notes: readonly string[], duration = '16n', spacing = 0.1) => {
      const synth = synthRef.current;
      if (!synth || isMutedRef.current) return;

      const context = getContext();
      if (context.state !== 'running') {
        await context.resume();
      }

      const now = Tone.now();
      notes.forEach((note, i) => {
        if (isMutedRef.current) return;
        synth.triggerAttackRelease(note, duration, now + i * spacing);
      });
    },
    []
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <SoundContext.Provider
      value={{ isMuted, toggleMute, setIsMuted, playSignal }}
    >
      {children}
    </SoundContext.Provider>
  );
};
