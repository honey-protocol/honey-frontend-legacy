import { Box, Text } from 'degen';
import React, { useState } from 'react';
import * as styles from './ToolTip.css';

const ToolTip = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box position="relative">
      <Box
        height="4"
        width="4"
        backgroundColor="accentSecondary"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="extraLarge"
        style={{ fontSize: '12px' }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        cursor="pointer"
      >
        <Text>i</Text>
      </Box>
      <Box className={styles.infoContainer} opacity={isOpen ? '100' : '0'}>
        <Text as="p" weight="medium">
          This box contains info about what the cursor is hovering over
        </Text>
      </Box>
    </Box>
  );
};

export default ToolTip;
