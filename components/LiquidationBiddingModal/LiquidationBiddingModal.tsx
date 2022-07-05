import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from './LiquidationBiddingModal.css';
import Link from 'next/link';
import { IconClose } from 'degen';

const LiquidationBiddingModal = () => {

  const [confirmState, setConfirmState] = useState(false);
  const [showModal, setShowModal] = useState(true)

  function handlePlaceBid() {
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }

  function handleClose() {
    setShowModal(false);
  }

  return (
    showModal && (
      <Box className={styles.liquidationBiddingModalWrapper}>
        <Box className={styles.closingAction} onClick={handleClose}>
          <IconClose />
        </Box>
        <Box>
          <Text>Market:</Text>
          <Text><i>SMB - Solana Monkey Business</i></Text>
        </Box>
        <Box>
          <Text>Minimum Bid Ask:</Text>
          <Text><i>312 SOL</i></Text>
        </Box>
        <Box>
          <Text>Current Highest Bid:</Text>
          <Box className={styles.bidWrapper}>
            <Text><i>310 SOL</i></Text>
            <Text>By: <i>HzA19f...</i></Text>
          </Box>
        </Box>
        {
          confirmState && (
            <Box className={styles.inputWrapper}>
              <Text>Place Bid</Text>
              <input type="number" />
            </Box>
          )
        }
        <Box className={styles.buttonWrapper}>
          {
            confirmState 
            ?
            <Button variant="primary">Confirm Bid</Button> 
            : 
            <Button variant="primary" onClick={handlePlaceBid}>Place Bid</Button> 
        }
        </Box>
      </Box> 
    )
  );
};

export default LiquidationBiddingModal;