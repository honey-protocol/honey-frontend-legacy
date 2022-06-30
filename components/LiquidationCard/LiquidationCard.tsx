import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';

interface LiquidationCardProps {
  loan: any;
}

const LiquidationCard = (props: LiquidationCardProps) => {
  const { loan } = props;

  function determineHealthStyles(healthFactor: string) {
    if (healthFactor == 'Healthy') {
      return styles.healthFactorHigh
    } else if (healthFactor == 'Medium') {
      return styles.healthFactorMedium
    } else {
      return styles.healthFactorLow
    }
  }

  return (
    <Box className={styles.subWrapper}>
      {
        loan && (
          <Box className={styles.subContainer}>
            <Box className={styles.imageWrapper}>
              <Avatar
                label="" size="15" src={loan.image}
              />
              <Text>{loan.title}</Text>
            </Box>
            <Text>{loan.debt}</Text>
            <Text>{loan.collateral}</Text>
            <Text>{loan.address}</Text>
            <Text>{loan.lr}</Text>
            <Text>{loan.ltv}</Text>
            <Box className={determineHealthStyles(loan.healthFactor)}>
              <Text>
                {loan.healthFactor}
              </Text>
            </Box>
            <Text>{loan.currentPrice} SOL</Text>
            <Text>
              <Button 
                variant="primary"
              >
                Place bid
              </Button>
            </Text>
          </Box>
        )
      }
    </Box>
  );
};

export default LiquidationCard;