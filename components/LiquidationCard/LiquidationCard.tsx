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
}

const LiquidationCard = (props: LiquidationCardProps) => {
  const [biddingModal, setBiddingModal] = useState(false);
  const { loan, openPositions, liquidationType, handleShowBiddingModal, showBiddingModal } = props;


  function determineHealthStyles(healthFactor: string) {
    if (healthFactor == 'Healthy') {
      return styles.healthFactorHigh
    } else if (healthFactor == 'Medium') {
      return styles.healthFactorMedium
    } else {
      return styles.healthFactorLow
    }
  }

  // function handleBiddingModal() {
  //   biddingModal == false ? setBiddingModal(true) : setBiddingModal(false);
  // }

  return (
    <Box className={styles.subWrapper}>
      {
        liquidationType ? (
          <Box onClick={handleShowBiddingModal} className={styles.subContainer}>
            <Text>{loan.position}</Text>
            <Text>{loan.debt} SOL</Text>
            <Text>{loan.address}</Text>
            <Text>{loan.lvt} %</Text>
            <Box className={styles.healthFactor}>{loan.healthFactor}</Box>
            <Text>{loan.highestBid} SOL</Text>
          </Box>
        ) : (
          <Link 
            href={`/liquidation/[collection]`}
            as={`/liquidation/${loan.collection}`}
            passHref
          >
            <Box className={styles.subContainer}>
              <Text>{loan.collection}</Text>
              <Text>{loan.totalCollateral} NFTs</Text>
              <Text>{loan.totalDebt} SOL</Text>
              <Text>{loan.averageLVT} %</Text>
              <Text>    
                <Button variant="primary">
                  Place bid
                </Button>
              </Text>
            </Box>
          </Link>
        )
      }
      <Box>
        {
          (showBiddingModal && handleShowBiddingModal) && (
            <LiquidationBiddingModal 
              handleShowBiddingModal={handleShowBiddingModal}
            />
          )
        }
      </Box>
    </Box>
  );
};

export default LiquidationCard;