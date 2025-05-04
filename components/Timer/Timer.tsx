'use client';

import styles from './Timer.module.scss';

type IPlayButton = {
  currentTime: number;
  time: number;
  children: React.ReactElement;
};

const Timer = ({ currentTime, time, children }: IPlayButton) => {
  return (
    <div
      className={styles.circleTimer}
      style={{
        ['--progress' as any]: `${(currentTime / time) * 360}deg`,
      }}
    >
      {children}
    </div>
  );
};

export default Timer;
