import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Text } from 'degen';
import Link from 'next/link';
import React from 'react';
import * as styles from './LoanHeaderComponent.css';

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
      <Link href="/loan/createmarket" passHref>
        <Button size="small">Create market</Button>
      </Link>

      <Button size="small">
        <a href="https://cofre.so/#/" target="_blank" rel="noreferrer">
          Mint Cofre NFT
        </a>
      </Button>
    </Box>
  );
};

export default LoanHeaderComponent;
