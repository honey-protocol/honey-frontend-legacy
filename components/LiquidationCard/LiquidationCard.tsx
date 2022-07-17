import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import Link from 'next/link'
import LiquidationBiddingModal from 'components/LiquidationBiddingModal/LiquidationBiddingModal';

interface LiquidationCardProps {
  loan: any;
  openPositions?: boolean;
  liquidationType?: boolean;
  handleShowBiddingModal?: () => void;
  showBiddingModal?: boolean;
  handleExecuteBid: () => void;
}

const LiquidationCard = (props: LiquidationCardProps) => {
  const { loan, openPositions, liquidationType, handleShowBiddingModal, showBiddingModal, handleExecuteBid } = props;

  return (
    <Box className={styles.subWrapper}>
      <Box className={styles.subContainer}>
        <Box className={styles.collectionCard}>
          <Box className={styles.collectionCardWrapper}>
            <Text>Position:</Text>
            <Text>{loan.position}</Text>
          </Box>
          <Box className={styles.collectionCardWrapper}>
            <Text>Debt:</Text>
            <Text>{loan.debt} SOL</Text>
          </Box>
          <Box className={styles.healthFactor}>{loan.healthFactor}</Box>
          <Box className={styles.collectionCardWrapper}>
            <Text>LVT:</Text>  
            <Text>{loan.lvt} %</Text>
          </Box>
          <Box className={styles.collectionCardWrapper}>
            <Text>Bid:</Text>  
            <Text>{loan.highestBid} SOL</Text>
          </Box>
          <Box className={styles.collectionCardWrapper}>
            <Text>Address:</Text>  
            <Text>{loan.address}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LiquidationCard;