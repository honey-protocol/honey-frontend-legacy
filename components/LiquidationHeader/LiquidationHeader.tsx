import { Box, Button, Text } from 'degen';
import React from 'react';
import * as styles from './LiquidationHeader.css';

interface LiquidationHeaderProps {
  headerData: any;
}

const LiquidationHeader = (props: LiquidationHeaderProps) => {
  const { headerData } = props;

  return (
    <Box className={styles.liquidationHeaderWrapper}>
      <Box className={styles.liquidationHeaderContainer}>
        {headerData.map((item: any, i: number) => {
          return (
            <Text size="small" key={i}>
              {item}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};

export default LiquidationHeader;
