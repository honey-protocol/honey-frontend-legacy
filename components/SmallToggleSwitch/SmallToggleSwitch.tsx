import { Box } from 'degen';
import React, { useEffect, useRef } from 'react';
import * as styles from './SmallToggleSwitch.css';

interface SmallToggleSwitchProps {
  isActive: boolean;
  setIsActive: Function;
}

const SmallToggleSwitch = (props: SmallToggleSwitchProps) => {
  const { isActive, setIsActive } = props;
  const checkboxRef = useRef<HTMLInputElement>(null);

  const onCheckChange = (event: any) => {
    console.log({ event });
    if (event.currentTarget.checked) {
      console.log('change');
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = isActive;
    }
  }, [isActive, checkboxRef]);

  return (
    <Box onClick={onCheckChange} className={styles.toggleSwitch}>
      <input
        ref={checkboxRef}
        className={styles.input}
        onChange={onCheckChange}
        checked={isActive}
        type="checkbox"
      />
      <span className={styles.slider}></span>
    </Box>
  );
};

export default SmallToggleSwitch;
