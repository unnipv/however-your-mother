'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'default' ? 'matcha' : 'default');
  };

  return (
    <div className={styles.switcherContainer}>
      <span 
        className={`${styles.themeLabel} ${styles.cappuccinoLabelText} ${theme === 'default' ? styles.activeLabel : ''}`}
      >
        Cappuccino
      </span>
      <label className={styles.toggleSwitch}>
        <input 
          type="checkbox" 
          className={styles.checkbox}
          checked={theme === 'matcha'} 
          onChange={handleToggle} 
          aria-label={theme === 'default' ? "Switch to Matcha theme" : "Switch to Cappuccino theme"}
        />
        <span className={styles.slider}></span>
      </label>
      <span 
        className={`${styles.themeLabel} ${styles.matchaLabelText} ${theme === 'matcha' ? styles.activeLabel : ''}`}
      >
        Matcha
      </span>
    </div>
  );
};

export default ThemeSwitcher;
