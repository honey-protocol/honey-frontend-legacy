import { Box, Button, Text } from 'degen';
import React from 'react';
import * as styles from './LiquidationHeader.css';

interface LiquidationHeaderProps {
  headerData: any;
  source: string;
}

const LiquidationHeader = (props: LiquidationHeaderProps) => {
  const { headerData, source } = props;

  return (

    source == 'market_overview' 
    ?
      <Box className={styles.liquidationHeaderWrapperOverview}>
        <Box className={styles.liquidationHeaderContainerOverview}>
          {headerData.map((item: any, i: number) => {
            return (
              <Text size="small" key={i}>
                {item}
              </Text>
            );
          })}
        </Box>
      </Box>
    :
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
