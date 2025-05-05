'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { getContext } from 'tone';

export function useMusicSignals() {
  const synthRef = useRef<Tone.PolySynth | null>(null);

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
    if (!synth) return;

    await ensureAudioContext();

    const now = Tone.now();
    notes.forEach((note, i) => {
      synth.triggerAttackRelease(note, duration, now + i * spacing);
    });
  };

  return {
    playSignal,
  };
}

export const SIGNAL_MELODIES = {
  start: ['C4', 'E4'],
  change: ['G4', 'E4'],
  stop: ['A3', 'F3'],
  tick: ['C5'],
  error: ['E4', 'C4'],
  success: ['C4', 'D4', 'E4'],
  warning: ['C4', 'C4'],
};
