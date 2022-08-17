import React, { useState } from 'react';
import { Box, Button, Text } from 'degen';
import * as styles from './LiquidationBiddingModal.css';
import { IconClose } from 'degen';
interface LiquidationBiddingModalProps {
  handleShowBiddingModal: () => void;
  handleExecuteBid: (val: any, userBid?: number) => void;
  hasPosition: boolean;
  highestBiddingAddress: string;
  highestBiddingValue: number;
  handleRefetch: () => void;
}

const LiquidationBiddingModal = (props: LiquidationBiddingModalProps) => {
  const {handleShowBiddingModal, handleExecuteBid, hasPosition, highestBiddingAddress, highestBiddingValue, handleRefetch} = props;
  // state to determine which buttons to show regarding position or no position
  const [confirmState, setConfirmState] = useState(false);
  const [userInput, setUserInput] = useState();
  const [increaseUserBid, setIncreaseUserBid] = useState(false);
  // set state handlers
  function handlePlaceBid() {
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }
  // set state handlers
  function handleIncreaseBid() {
    increaseUserBid == false ? setIncreaseUserBid(true) : setIncreaseUserBid(false);
    confirmState == false ? setConfirmState(true) : setConfirmState(false);
  }
  /**
   * @description processes the action of a user; 
   * @params type string; place_bid | increase_bid | revoke_bid
   * @returns executes the handler in the parent component which fires off SDK hook
  */
  function processBid(type: string) {
    if (type == 'revoke_bid') {
      handleExecuteBid(type);
    } else if (type == 'place_bid') {
      if (userInput) {
        handleExecuteBid(type, userInput);
      }
    } else if (type == 'increase_bid') {
      if (userInput) {
        handleExecuteBid(type, userInput); 
      }
    }
    handleRefetch();
  }
  /**
   * @description set current user input regarding bid
   * @params input object containing value
   * @returns sets state
  */
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
              <Text><i>{(highestBiddingValue * 1.1).toFixed(2)}</i></Text>
            </Box>
            <Box>
              <Text>Current Highest Bid:</Text>
              <Box>
                <Text><i>{highestBiddingValue} SOL</i></Text>
                <Text>By: <i>{highestBiddingAddress?.substring(0, 4)}...</i></Text>
              </Box>
            </Box>
            {
              confirmState && (
                <Box className={styles.inputWrapper}>
                  <Text>Place Bid</Text>
                  <input 
                    type="number" 
                    onChange={handleUserChange}
                    defaultValue={userInput}
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
                <Box className={styles.baseWrapper}>
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