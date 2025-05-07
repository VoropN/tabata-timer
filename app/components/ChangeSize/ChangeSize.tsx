'use client';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
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
  const timer = useRef<NodeJS.Timeout>(null);
  const call = (func: () => void) => {
    timer.current = setInterval(() => func(), 50);
  };

  const timeoutClear = () => {
    clearInterval(timer.current ?? 0);
  };

  return (
    <>
      <button
        className={styles.changeSize}
        onMouseLeave={timeoutClear}
        onMouseUp={timeoutClear}
        onMouseDown={() => call(decreaseSize)}
        onTouchStart={() => call(decreaseSize)}
        onTouchEnd={timeoutClear}
        onTouchCancel={timeoutClear}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      {children}
      <button
        className={styles.changeSize}
        onMouseLeave={timeoutClear}
        onMouseUp={timeoutClear}
        onMouseDown={() => call(increaseSize)}
        onTouchStart={() => call(increaseSize)}
        onTouchEnd={timeoutClear}
        onTouchCancel={timeoutClear}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </>
  );
};

export default ChangeSize;
