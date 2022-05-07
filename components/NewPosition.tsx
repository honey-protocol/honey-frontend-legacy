import React, { useContext, useState } from 'react';
import { Box, Button, Stack, Text } from 'degen';
import { Avatar } from 'degen';
import * as loanStyles from '../styles/loan.css';

interface LoanNewBorrowProps {
  NFT: any;
  buttonTitle?: Function;
  mint?: any;
  executeDepositNFT: (key: any) => void;
  loanPositions: any;
}

const LoanNewBorrow = (props: LoanNewBorrowProps) => {
  const { NFT, mint, executeDepositNFT, loanPositions } = props;
  console.log('inside borrow new component', NFT)

  if (!NFT) return null;

  return (
    <Box display="flex" paddingTop="5" gap="3" minHeight="full" className={loanStyles.loanWrapper}>
      <Stack flex={1} justify={'space-between'}>
        <Stack justify="space-between">
          <Stack justify="space-between" align="center">
            <Text weight="semiBold" variant="large">
              {NFT.name}
            </Text>
            <Avatar shape="square" label="" size="52" src={NFT?.image} />
          </Stack>
        </Stack>
        <Stack>
          <hr className={loanStyles.lineDivider}></hr>
          <Box paddingTop="1" paddingBottom="1">
            <Stack justify="space-between">
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left" color="textSecondary">
                  Borrow APY
                </Text>
                <Text align="right" color="foreground">
                  10%
                </Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left" color="textSecondary">
                  Estimated value
                </Text>
                <Text align="right" color="foreground">
                  5 SOL
                </Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left" color="textSecondary">
                  Loan to value ratio
                </Text>
                <Text align="right" color="foreground">
                  50%
                </Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left" color="textSecondary">
                  Liquidation threshold
                </Text>
                <Text align="right" color="foreground">
                  50%
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Box marginBottom="10">
          <Button
            onClick={() => executeDepositNFT(NFT.mint)}
            width="full"
          >
            Deposit
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanNewBorrow;