'use client';

import styles from './Timer.module.scss';

type IPlayButton = {
  currentTime: number;
  time: number;
  children: React.ReactElement;
};

const Timer = ({ currentTime, time, children }: IPlayButton) => {
  const progress =
    time > 0 ? `${(currentTime / time) * 360}deg` : '0deg';

  return (
    <div
      className={styles.circleTimer}
      style={{
        ['--progress' as string]: progress,
      }}
    >
      {children}
    </div>
  );
};

export default Timer;
