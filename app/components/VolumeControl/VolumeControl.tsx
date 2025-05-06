'use client';

import { useSound } from '@/app/contexts';
import { useLoading } from '@/app/hooks/useLoading';
import { faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import styles from './VolumeControl.module.scss';

const VolumeControl = () => {
  const { isMuted, toggleMute } = useSound();
  const { isLoading } = useLoading();
  if (isLoading) return <></>;

  return (
    <Button
      className={styles.volumeControl}
      onClick={toggleMute}
      icon={isMuted ? faVolumeMute : faVolumeHigh}
    />
  );
};

export default VolumeControl;
