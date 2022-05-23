import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface LoanWithdrawProps {
  evaluation: number;
  interestRate: number;
  assetsBorrowed: number;
  totalInterest: number;
  totalPayback: number;
  handleWithdraw: (value: number) => void;
  marketValue: any;
}

const LoanWithdraw = (props: LoanWithdrawProps) => {
  const {
    evaluation,
    interestRate,
    assetsBorrowed,
    totalInterest,
    totalPayback,
    handleWithdraw,
    marketValue
  } = props;
  
  /**
   * @description
   * @params
   * @returns
  */
  const [userMessage, setUserMessage] = useState('');
  const [userInput, setUserInput] = useState(0);
  /**
   * @description
   * @params
   * @returns
  */
  function handleChange(value: any) {
    setUserInput(value.target.value)
  }
  /**
   * @description
   * @params
   * @returns
  */
  function executeWithdraw() {
    handleWithdraw(userInput ? userInput : 1);
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
      <Stack>
        {/* Assets deposited */}
        <Stack justify="space-between">
          <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="textSecondary">
              Assets deposited
            </Text>
            <Text align="right" color="foreground">
              TBA
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
            <Text align="right" color="textPrimary">
            {/* {(totalDeposits / LAMPORTS_PER_SOL).toFixed(2)} SOL */}
            {/* {marketValue.toFixed(2)} SOL */}
            .. SOL
            </Text>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="vertical" space="4">
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
          <Button width="full" onClick={executeWithdraw}>Withdraw</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanWithdraw;