import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from './LiquidationBiddingModal.css';
import Link from 'next/link';
import { IconClose } from 'degen';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toastResponse } from 'helpers/loanHelpers';

interface LiquidationBiddingModalProps {
  handleShowBiddingModal: () => void;
  handleExecuteBid: (val: any, userBid?: number) => void;
  hasPosition: boolean;
  stringyfiedWalletPK: any;
  highestBiddingAddress: string;
  highestBiddingValue: number;
}

const LiquidationBiddingModal = (props: LiquidationBiddingModalProps) => {
  const {handleShowBiddingModal, handleExecuteBid, hasPosition, stringyfiedWalletPK, highestBiddingAddress, highestBiddingValue} = props;

  const [confirmState, setConfirmState] = useState(false);
  const [userInput, setUserInput] = useState();
  const [increaseUserBid, setIncreaseUserBid] = useState(false);

  function handlePlaceBid() {
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }

  function handleIncreaseBid() {
    increaseUserBid == false ? setIncreaseUserBid(true) : setIncreaseUserBid(false);
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }

  function processBid(type: string) {
    console.log('process bid running', type)
    if (type == 'revoke_bid') {
      handleExecuteBid(type);
    } else if (type == 'place_bid') {
      console.log('this is userInput', userInput)
      if (userInput) {
        handleExecuteBid(type, userInput);
      }
    } else if (type == 'increase_bid') {
      if (userInput) {
        // if (userInput < (highestBiddingValue + .1)) {
        //   return toastResponse('ERROR', 'Bid not high enough', 'ERROR');
        // };
        handleExecuteBid(type, userInput); 
      }
    }
    
  }

  function handleUserChange(val: any) {
    setUserInput(val.target.value);
  }

  // if (hasPosition == true) setConfirmState(true);

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
              <Box>
                <Text><i>{highestBiddingValue} SOL</i></Text>
                <Text>By: <i>{highestBiddingAddress.substring(0, 4)}...</i></Text>
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
                    placeholder={userInput}
                  />
                </Box>
              )
            }
            {
              hasPosition
              ?
              (
                <div>
                  {
                    hasPosition && increaseUserBid
                    ?
                    <Button variant="primary" onClick={() => processBid('increase_bid')}>Place Bid</Button>
                    :
                    <Button variant="primary" onClick={handleIncreaseBid}>Increase Bid</Button>
                  }
                  <Button variant="primary" onClick={() => processBid('revoke_bid')}>Revoke Bid</Button>
                </div>
              )
              : 
              (
                <Box>
                {
                  confirmState 
                  ?
                  <Button variant="primary" onClick={() => processBid('place_bid')}>Confirm Bid</Button> 
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