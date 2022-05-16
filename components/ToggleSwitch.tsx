import { Box, Button, Stack } from 'degen';
import React, { useState } from 'react';
import {TYPE_PRIMARY, TYPE_SECONDARY} from '../constants/loan';

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
    >
      <Stack direction="horizontal" align="center" space="1.5">
        {buttons.map((button, i) => (
          <Box flex={1} paddingRight="1.5" key={button.title}>
            <Button
              width="full"
              onClick={() => button.onClick()}
              variant={i === activeIndex ? TYPE_PRIMARY : TYPE_SECONDARY}
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
