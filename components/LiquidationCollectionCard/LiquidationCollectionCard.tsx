import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import Link from 'next/link';
import VerifiedIcon from 'icons/VerifiedIcon';

interface LiquidationCollectionCardProps {
  loan: any;
  openPositions: boolean;
}

const LiquidationCollectionCard = (props: LiquidationCollectionCardProps) => {
  const { loan, openPositions } = props;

  return (
    <Box className={styles.subWrapper}>
      {
        openPositions && <VerifiedIcon />
      }
      <Link 
        href={`/liquidation/[collection]`}
        as={`/liquidation/${loan.collection}`}
        passHref
      >
        <Box className={styles.subContainerOverview}>
          <Text>{loan.collection}</Text>
          <Text>{loan.totalCollateral} NFTs</Text>
          <Text>{loan.averageLTV}%</Text>
          <Text>{loan.totalDebt} SOL</Text>
          <Text>    
            {
              openPositions
              ?
              <Button variant="primary">
                Review bid
              </Button>
              :
              <Button variant="primary">
                Place bid
              </Button>
            }
          </Text>
        </Box>
      </Link>
    </Box>
  );
};

export default LiquidationCollectionCard;