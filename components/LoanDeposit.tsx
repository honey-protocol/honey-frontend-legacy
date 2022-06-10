import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {toastResponse} from '../helpers/loanHelpers/index';

interface LoanDepositProps {
  borrowApy: number;
  estValue: number;
  assetsBorrowed: number;
  netBorrowBalance: number;
  handleDeposit: (value: any) => void;
  userTotalDeposits: any;
  totalMarkDeposits: number;
}

const LoanDeposit = (props: LoanDepositProps) => {
  const { borrowApy, estValue, assetsBorrowed, netBorrowBalance, handleDeposit, userTotalDeposits, totalMarkDeposits } = props;
  /**
   * @description
   * @params
   * @returns
  */
  const [userMessage, setUserMessage] = useState('');
  const [userInput, setUserInput] = useState();
  /**
   * @description
   * @params
   * @returns
  */
  function handleChange(value: any) {
    let userValue = value.target.value
    const validated = userValue.match(/^(\d*\.{0,1}\d{0,2}$)/)
    if (validated) {
      setUserInput(userValue)
    }
  }
  /**
   * @description
   * @params
   * @returns
  */
  function executeDeposit() {
    if (userInput) {
      handleDeposit(userInput)
    } else {
      toastResponse('ERROR', 'Please provide an amount', 'ERROR');
    }
  }

  return (
    <Box
      flex={1}
      gap="4"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginTop="8"
      className={loanStyles.mainComponentWrapper}
      paddingBottom="min"
    >
      {/* Vault data row */}
      <Stack align="center">
        <Avatar label="" size="15" src={'/nfts/2738.png'} />
        <Text
          align="right"
          weight="semiBold"
          color="foreground"
          variant="large"
        >
          Solana Monkey Business
        </Text>
      </Stack>
      <Box paddingTop="1" paddingBottom="1">
        <Stack justify="space-between" space="6">
          <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="textSecondary">
              Assets Deposited
            </Text>
            <Text align="right" color="foreground">
              {userTotalDeposits}
            </Text>
          </Stack>
          <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="textSecondary">
              Total balance
            </Text>
            <Text align="right" color="foreground">
              {totalMarkDeposits} SOL
            </Text>
          </Stack>
        </Stack>
      </Box>
      <Stack direction="vertical" space="6">
        <Box className={styles.errorMessage}>
          {userMessage && userMessage}
        </Box>  
        {/* Borrowed amount and currency */}
        <Box className={styles.selectionWrapper}>
          <Box className={styles.selectionDetails}>
            <input type="number" placeholder='0.00' step=".01" onChange={(value) => handleChange(value)} className={styles.currencyStyles} value={userInput} min="1" max="2" />
            <Avatar
              label="TetranodeNFT"
              size="7"
              shape="square"
              src={
                'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422'
              }
            />
            <select
              name="currencySelector"
              id="currencySelector"
              className={styles.currencySelector}
            >
              <option value="SOL">SOL</option>
            </select>
          </Box>
        </Box>
        <Box height="16">
          <Button width="full" onClick={executeDeposit}>Deposit</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanDeposit;
