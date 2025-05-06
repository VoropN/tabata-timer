'use client';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { MouseEventHandler, ReactNode } from 'react';
import styles from './Button.module.scss';

type IButton = {
  icon?: IconDefinition | false;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  type?: 'icon';
};

const Button = ({ icon, children, onClick, className, type }: IButton) => {
  return (
    <button
      className={clsx(
        { [styles.iconButton]: icon || type === 'icon' },
        className
      )}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon className={styles.icon} icon={icon} />}
      {children}
    </button>
  );
};

export default Button;
