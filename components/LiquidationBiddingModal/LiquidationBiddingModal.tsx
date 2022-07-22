import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from './LiquidationBiddingModal.css';
import Link from 'next/link';
import { IconClose } from 'degen';

interface LiquidationBiddingModalProps {
  handleShowBiddingModal: () => void;
  handleExecuteBid: () => void;
  hasPosition: boolean;
}

const LiquidationBiddingModal = (props: LiquidationBiddingModalProps) => {
  const {handleShowBiddingModal, handleExecuteBid, hasPosition} = props;
  const [confirmState, setConfirmState] = useState(false);
  const [userInput, setUserInput] = useState<number>();

  function handlePlaceBid() {
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }

  function processBid() {
    handleExecuteBid()
  }

  function handleUserChange(val: any) {
    setUserInput(val.target.value);
  }

  return (
    <Box>
          <Box className={styles.liquidationBiddingModalWrapper}>
            <Box className={styles.closingAction} onClick={handleShowBiddingModal}>
              <IconClose />
            </Box>
            <Box>
              <Text>Market:</Text>
              <Text><i>HNY - Honey Eyes</i></Text>
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
                  <input 
                    type="number" 
                    onChange={handleUserChange}
                    value={userInput}
                    placeholder="0.00"
                  />
                </Box>
              )
            }
            {
              hasPosition
              ?
              (
                <div>
                  <Button variant="primary" onClick={handlePlaceBid}>Increace Bid</Button>
                  <Button variant="primary" onClick={processBid}>Revoke Bid</Button>
                </div>
              )
              : 
              (
                <Box className={styles.buttonWrapper}>
                {
                  confirmState 
                  ?
                  <Button variant="primary" onClick={processBid}>Confirm Bid</Button> 
                  : 
                  <Button variant="primary" onClick={handlePlaceBid}>Place Bid</Button>
                }
                </Box>
              )

              }
          </Box> 
    </Box>
  )
};

export default LiquidationBiddingModal;