'use client';

import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StopButton.module.scss';

type IPlayButton = {
  currentTime: number;
  time: number;
};

const StopButton = ({ currentTime, time }: IPlayButton) => {
  return (
    <div
      className={styles.circleTimer}
      style={{
        ['--progress' as any]: `${(currentTime / time) * 360}deg`,
      }}
    >
      <FontAwesomeIcon className={styles.icon} icon={faPause} />
    </div>
  );
};

export default StopButton;
