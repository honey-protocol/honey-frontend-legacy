import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import Link from 'next/link'
import LiquidationBiddingModal from 'components/LiquidationBiddingModal/LiquidationBiddingModal';

interface LiquidationCollectionCardProps {
  loan: any;
}

const LiquidationCollectionCard = (props: LiquidationCollectionCardProps) => {
  const { loan } = props;

  return (
    <Box className={styles.subWrapper}>
          <Link 
            href={`/liquidation/[collection]`}
            as={`/liquidation/${loan.collection}`}
            passHref
          >
            <Box className={styles.subContainer}>
              <Text>{loan.collection}</Text>
              <Text>{loan.totalCollateral} NFTs</Text>
              <Text>{loan.averageLTV}%</Text>
              <Text>{loan.totalDebt} SOL</Text>
              <Text>    
                <Button variant="primary">
                  Place bid
                </Button>
              </Text>
            </Box>
          </Link>
    </Box>
  );
};

export default LiquidationCollectionCard;