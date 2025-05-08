'use client';

import { useSound } from '@/app/contexts';
import { useLoading } from '@/app/hooks/useLoading';
import {
  faRefresh,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import styles from './Settings.module.scss';

const VolumeControl = () => {
  const { isMuted, toggleMute } = useSound();
  const { isLoading } = useLoading();
  if (isLoading) return <></>;

  return (
    <>
      <Button
        className={styles.refresh}
        onClick={() => window.location.reload()}
        icon={faRefresh}
      />
      <Button
        className={styles.volumeControl}
        onClick={toggleMute}
        icon={isMuted ? faVolumeMute : faVolumeHigh}
      />
    </>
  );
};

export default VolumeControl;
