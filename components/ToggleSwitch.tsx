import { Box, Button, Stack } from 'degen';
import React, { useState } from 'react';

interface ToggleSwitchProps {
  buttons: {
    title: string;
    onClick: Function;
  }[];
  activeIndex: number;
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  const { buttons, activeIndex } = props;

  return (
    <Box
      borderRadius="large"
      backgroundColor="foregroundSecondary"
      paddingTop="2"
      paddingLeft="2"
      paddingBottom="2"
      // padding="2"
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
              variant={i === activeIndex ? 'primary' : 'secondary'}
              key={i}
              size="small"
            >
              {button.title}
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ToggleSwitch;
