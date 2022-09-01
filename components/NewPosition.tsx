import React, { useContext, useState } from 'react';
import { Box, Button, Stack, Text } from 'degen';
import { Avatar } from 'degen';
import * as loanStyles from '../styles/loan.css';
import CollateralPopup from '../components/CollateralPopup/CollateralPopup';
import { toastResponse } from 'helpers/loanHelpers';

interface LoanNewBorrowProps {
  NFT: any;
  buttonTitle?: Function;
  mint?: any;
  executeDepositNFT: (key: any) => void;
  loanPositions: any;
  parsedReserves: any;
  openPositions: any;
  userAvailableNFTs: any;
  reFetchNFTs: (val: any) => void;
  refreshPositions: () => void;
  liqidationThreshold: number;
  nftPrice: number;
}

const LoanNewBorrow = (props: LoanNewBorrowProps) => {
  const { NFT, mint, executeDepositNFT, loanPositions, parsedReserves, openPositions, userAvailableNFTs, reFetchNFTs, refreshPositions, liqidationThreshold, nftPrice } = props;
  const [showCollateralPopup, setShowCollateralPopup] = useState(0);

  async function handleExecute(val: any) {
    if (openPositions?.length > 0) {
      setShowCollateralPopup(1);
      return;
    }

    executeDepositNFT(val);
  }


  if (!NFT) return null;

  function handleNoPosition() {
    toastResponse('ERROR', 'Currently loans are limited to 1 open position', 'ERROR');
  }

  return (
    <Box
      display="flex"
      paddingTop="5"
      gap="3"
      className={loanStyles.loanWrapper}
    >
      {showCollateralPopup == 1 && handleNoPosition()}
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
            <Stack justify="flex-start">
              {/* <Stack
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
              </Stack> */}
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left" color="textSecondary">
                  Estimated value of your collateral
                </Text>
                <Text align="right" color="foreground">
                  {nftPrice.toFixed(4)}
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
                  0%
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
                  {liqidationThreshold}%
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Box marginBottom="10">
          <Button
            onClick={() => handleExecute(NFT.mint)}
            width="full"
            size="small"
          >
            Deposit
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoanNewBorrow;