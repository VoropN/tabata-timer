export type Preset = {
  name: string;
  description: string;
  workTime: number;
  restTime: number;
  rounds: number;
  emoji: string;
};

export const PRESETS: Preset[] = [
  {
    name: 'Classic Tabata',
    description: 'The original protocol by Dr. Izumi Tabata',
    emoji: '🔥',
    workTime: 20,
    restTime: 10,
    rounds: 8,
  },
  {
    name: 'HIIT Blast',
    description: 'High intensity intervals with brief recovery',
    emoji: '⚡',
    workTime: 45,
    restTime: 15,
    rounds: 10,
  },
  {
    name: 'Power Intervals',
    description: 'Longer bursts for endurance building',
    emoji: '💪',
    workTime: 60,
    restTime: 30,
    rounds: 8,
  },
  {
    name: 'Boxing Rounds',
    description: 'Classic amateur boxing round structure',
    emoji: '🥊',
    workTime: 180,
    restTime: 60,
    rounds: 12,
  },
  {
    name: 'MMA Rounds',
    description: 'Mixed martial arts competition timing',
    emoji: '🥋',
    workTime: 300,
    restTime: 60,
    rounds: 5,
  },
  {
    name: 'Gibala Protocol',
    description: 'Sprint intervals with long recovery periods',
    emoji: '🏃',
    workTime: 30,
    restTime: 240,
    rounds: 10,
  },
  {
    name: 'Quick Test',
    description: 'Fast 3-round check for warm-up or testing',
    emoji: '⏱️',
    workTime: 5,
    restTime: 5,
    rounds: 3,
  },
];

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

export const calcTotalDuration = (preset: Preset): number => {
  const { workTime, restTime, rounds } = preset;
  const oneRound = workTime + restTime;
  return oneRound > 0 ? oneRound * rounds - restTime : 0;
};
