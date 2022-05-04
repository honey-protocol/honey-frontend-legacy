import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';

interface LoanWithdrawProps {
  nftName: string;
  evaluation: number;
  interestRate: number;
  assetsBorrowed: number;
  totalInterest: number;
  totalPayback: number;
  handleWithdraw: (value: number) => void;
}

const LoanWithdraw = (props: LoanWithdrawProps) => {
  const {
    nftName,
    evaluation,
    interestRate,
    assetsBorrowed,
    totalInterest,
    totalPayback,
    handleWithdraw
  } = props;

  // state handler for user input
  const [userInput, setUserInput] = useState(0);

  function handleState(val: any) {
    setUserInput(val);
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
              $0
            </Text>
          </Stack>
          <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="foreground">
              0 SOL
            </Text>
            <Text align="right" color="foreground">
              $0
            </Text>
          </Stack>
        </Stack>
        <Box
          backgroundColor="text"
          style={{ width: '100%', opacity: '0.5', height: '1px' }}
        />
        {/* Interest & payback data*/}
        <Stack justify="space-between">
          <Stack
            direction="horizontal"
            justify="space-between"
            align="center"
            space="2"
          >
            <Text align="left" color="textSecondary">
              Interest earned
            </Text>
            <Text align="right" color="foreground">
              $0
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
              $0
            </Text>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="vertical" space="4">
        {/* Borrowed amount and currency */}
        <Box className={styles.selectionWrapper}>
          <Box>
            <Button size="small" variant="secondary">
              Max
            </Button>
          </Box>
          <Box className={styles.selectionDetails}>
            <input type="number" placeholder='0' onChange={(value) => handleState(value)} className={styles.currencyStyles} />
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
          <Button width="full" onClick={() => handleWithdraw(userInput)}>Withdraw</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanWithdraw;
