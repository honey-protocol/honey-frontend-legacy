import { Box, Button, Text } from 'degen';
import React from 'react';
import * as styles from './LiquidationHeader.css';

interface LiquidationHeaderProps {
}

const LiquidationHeader = (props: LiquidationHeaderProps) => {
  // const { } = props;

  return (
    <Box className={styles.liquidationHeaderWrapper}>
      <Box className={styles.liquidationHeaderContainer}>
        <Text>Loans</Text>
        <Text>Debt</Text>
        <Text>Collateral</Text>
        <Text>Address</Text>
        <Text>LR(%)</Text>
        <Text>LTV(%)</Text>
        <Text></Text>
      </Box>
    </Box>
  );
};

export default LiquidationHeader;
