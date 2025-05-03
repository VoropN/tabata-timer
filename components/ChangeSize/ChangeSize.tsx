import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ChangeSize.module.scss';

interface ChangeSizeProps {
  children: React.ReactNode;
  increaseSize: () => void; // Function to increase size
  decreaseSize: () => void; // Function to decrease size
}

const ChangeSize: React.FC<ChangeSizeProps> = ({
  children,
  increaseSize,
  decreaseSize,
}) => {
  return (
    <div>
      <button className={styles.changeSize} onClick={decreaseSize}>
        <FontAwesomeIcon icon={faMinus} size="lg" />
      </button>
      {children}
      <button className={styles.changeSize} onClick={increaseSize}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
    </div>
  );
};

export default ChangeSize;
