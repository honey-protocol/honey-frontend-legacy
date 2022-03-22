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
    <Box
      backgroundColor="foregroundSecondary"
      paddingTop="1"
      paddingLeft="1"
      paddingBottom="1"
    >
      <Stack
        direction="horizontal"
        align="center"
        space="1.5"
        justify="space-around"
      >
        {buttons.map((button, i) => (
          <Box paddingRight="1.5" key={button.title}>
            <Button
              onClick={() => button.onClick()}
              variant={i === activeIndex ? 'primary' : 'tertiary'}
              key={i}
              width="full"
            >
              {button.title}
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ToggleSwitchLoan;
