import React from 'react';
import styles from './KeypadButton.module.css';

export type KeypadSize = 'small' | 'medium' | 'large';

interface KeypadButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: KeypadSize;
  className?: string;
  selected?: boolean;
  used?: boolean;
}

export default function KeypadButton({
  children,
  onClick,
  disabled = false,
  size = 'medium',
  className = '',
  selected = false,
  used = false,
}: KeypadButtonProps) {
  const sizeClass = styles[size];
  const selectedClass = selected ? styles.selected : '';
  const usedClass = used ? styles.used : '';

  return (
    <button
      className={`${styles.keypadButton} ${sizeClass} ${selectedClass} ${usedClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
