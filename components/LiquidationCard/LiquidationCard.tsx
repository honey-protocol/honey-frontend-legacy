import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import Link from 'next/link'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import LiquidationBiddingModal from 'components/LiquidationBiddingModal/LiquidationBiddingModal';

// interface LiquidationCardProps {
//   debt: number;
//   address: PublicKey;
//   ltv: number;
//   isHealthy: boolean;
//   highestBid: number;
//   openPositions?: boolean;
//   liquidationType?: boolean;
//   handleShowBiddingModal?: () => void;
//   showBiddingModal?: boolean;
//   handleExecuteBid: () => void;
//   key: number;
// }
interface LiquidationCardProps {
  loan: any;
  openPositions?: boolean;
  liquidationType?: boolean;
  handleShowBiddingModal?: () => void;
  showBiddingModal?: boolean;
  handleExecuteBid: () => void;
  key: number;
}

const LiquidationCard = (props: LiquidationCardProps) => {
  const { openPositions, liquidationType, handleShowBiddingModal, showBiddingModal, handleExecuteBid, loan, key } = props;
  console.log('@@@@---', loan)

  return (
        <Box className={styles.subWrapper}>
        <Box className={styles.subContainer}>
          <Box className={styles.collectionCard}>
            <Box className={styles.collectionCardWrapper}>
              <Text>Position:</Text>
              <Text>1</Text>
            </Box>
            <Box className={styles.collectionCardWrapper}>
              <Text>Debt:</Text>
              <Text>{loan.debt} SOL</Text>
            </Box>
            {
              loan.is_healthy 
              ? 
              <Box className={styles.healthFactor}>High</Box>
              :
              <Box className={styles.healthFactorMedium}>Medium</Box>

            }
            <Box className={styles.collectionCardWrapper}>
              <Text>LVT:</Text>  
              <Text>{loan.ltv} %</Text>
            </Box>
            <Box className={styles.collectionCardWrapper}>
              <Text>Bid:</Text>  
              <Text>{loan.highest_bid / LAMPORTS_PER_SOL} SOL</Text>
            </Box>
            <Box className={styles.collectionCardWrapper}>
              <Text>Address:</Text>  
              <Text>{loan.address.toString().substring(0,5)}...</Text>
            </Box>
          </Box>
        </Box>
      </Box>
  );
};

export default LiquidationCard;