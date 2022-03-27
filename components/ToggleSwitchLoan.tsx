import { Box, Button, Stack } from 'degen';
import React, { useState } from 'react';
import * as styles from '../styles/toggleSwitch.css';

interface ToggleSwitchProps {
  buttons: {
    title: string;
    onClick: Function;
  }[];
  activeIndex: number;
}

const ToggleSwitchLoan = (props: ToggleSwitchProps) => {
  const { buttons, activeIndex } = props;

  return (
    <Box className={styles.buttonWrapper}>
        {buttons.map((button, i) => (
          <button
            onClick={() => button.onClick()}
            variant={i === activeIndex ? 'primary' : 'tertiary'}
            key={i}
            width="full"
          >
            {button.title}
          </button>
        ))}
    </Box>
  );
};

export default ToggleSwitchLoan;
