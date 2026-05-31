import {
    calcTotalDuration,
    formatDuration,
    type Preset,
  } from '@/app/lib/presets';
import styles from './PresetItem.module.scss';


export type PresetItemProps = {
  preset: Preset;
  handleSelect: (preset: Preset) => void;
  disabled?: boolean;
};
  
export const PresetItem = ({ preset, handleSelect, disabled }: PresetItemProps) => {
  const total = calcTotalDuration(preset);

  return <button
    type="button"
    disabled={disabled}
    className={styles.card}
    onClick={() => handleSelect(preset)}
  >
    <span className={styles.cardEmoji} aria-hidden="true">
      {preset.emoji}
    </span>
    <span className={styles.cardBody}>
      <span className={styles.cardName}>{preset.name}</span>
      <span className={styles.cardDesc}>{preset.description}</span>
      <span className={styles.cardTags}>
        <span className={styles.tagWork}>
          Work {formatDuration(preset.workTime)}
        </span>
        <span className={styles.tagRest}>
          Rest {formatDuration(preset.restTime)}
        </span>
        <span className={styles.tagRounds}>
          {preset.rounds} rounds
        </span>
      </span>
    </span>
    <span className={styles.cardTotal}>
      {formatDuration(total)}
    </span>
  </button>
}

export default PresetItem;