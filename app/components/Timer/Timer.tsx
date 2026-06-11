'use client';

import styles from './Timer.module.scss';

type IPlayButton = {
  currentTime: number;
  time: number;
  children: React.ReactElement;
};

const Timer = ({ currentTime, time, children }: IPlayButton) => {
  const radius = 45;
  const strokeDasharray = 2 * Math.PI * radius;
  const progress = time > 0 ? currentTime / time : 0;
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <div className={styles.circleTimer}>
      <svg className={styles.svg} viewBox="0 0 100 100">
        <circle
          className={styles.bgCircle}
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className={styles.fgCircle}
          cx="50"
          cy="50"
          r={radius}
          style={{
            strokeDasharray,
            strokeDashoffset,
            // Disable transition when reset to 0
            transition: currentTime === 0 ? 'none' : 'stroke-dashoffset 1s linear',
          }}
        />
      </svg>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Timer;
