import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface LoanDepositProps {
  borrowApy: number;
  estValue: number;
  assetsBorrowed: number;
  netBorrowBalance: number;
  handleDeposit: () => void;
  totalDeposits: any;
}

const LoanDeposit = (props: LoanDepositProps) => {
  const { borrowApy, estValue, assetsBorrowed, netBorrowBalance, handleDeposit, totalDeposits } = props;

  const [userMessage, setUserMessage] = useState('');
  const [userInput, setUserInput] = useState(0);

  function handleMaxMessage() {
    setUserMessage('Max input is 2');
  }

  function handleChange(value: any) {
    if (value.target.value < 0) return;
     value.target.value <= 2 ? setUserInput(value.target.value) : handleMaxMessage();
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
              TBA
            </Text>
          </Stack>
          {/* <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="textSecondary">
              Supply APY
            </Text>
            <Text align="right" color="foreground">
              0%
            </Text>
          </Stack> */}
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
              {(totalDeposits / LAMPORTS_PER_SOL).toFixed(2)} SOL
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
            <input type="number" placeholder='0' onChange={(value) => handleChange(value)} className={styles.currencyStyles} value={userInput} min="1" max="2" />
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
          <Button width="full" onClick={handleDeposit}>Deposit</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanDeposit;
