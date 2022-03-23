import { Box, Button, Stack } from 'degen';
import React, { useState } from 'react';

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
    <Box>
      <Stack
        direction="horizontal"
        align="center"
        space="1.5"
        justify="space-around"
      >
        {buttons.map((button, i) => (
          <Button
            onClick={() => button.onClick()}
            variant={i === activeIndex ? 'primary' : 'tertiary'}
            key={i}
            width="full"
          >
            {button.title}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default ToggleSwitchLoan;
