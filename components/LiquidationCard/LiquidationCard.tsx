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
      <Box onClick={handleShowBiddingModal} className={styles.subContainer}>
        <Text>{loan.position}</Text>
        <Text>{loan.debt} SOL</Text>
        <Text>{loan.address}</Text>
        <Text>{loan.lvt} %</Text>
        <Box className={styles.healthFactor}>{loan.healthFactor}</Box>
        <Text>{loan.highestBid} SOL</Text>
      </Box>
    </Box>
  );
};

export default LiquidationCard;