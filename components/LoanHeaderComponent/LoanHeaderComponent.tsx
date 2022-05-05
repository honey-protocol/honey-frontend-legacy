import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text, IconPlus } from 'degen';
import React from 'react';
import * as styles from './LoanHeaderComponent.css';
// Styles for the header component on the load page: WIP - should become dynamic
const LoanHeaderComponent = () => {
  return (
    <Box className={styles.headerWrapper}>
      <Box>
        <Text>
          Health Factor <span>Healthy</span>
        </Text>
        <Text weight="medium" color="textSecondary">
          100%
        </Text>
      </Box>
      <Box>
        <Text>Borrow Balance</Text>
        <Text weight="medium" color="textSecondary">
          0$
        </Text>
      </Box>
      <Box>
        <Text>Supply Balance</Text>
        <Text weight="medium" color="textSecondary">
          0$
        </Text>
      </Box>
      <Box>
        <Text>Your positions</Text>
        <Text weight="medium" color="textSecondary">
          0
        </Text>
      </Box>
      <Button size="small">
        <a href="https://cofre.so/#/" target="_blank" rel="noreferrer">Mint Cofre NFT</a>
      </Button>
    </Box>
  );
};

export default LoanHeaderComponent;
