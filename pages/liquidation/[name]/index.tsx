import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';

/**
 * @description
 *  static nft object based off current posted as collateral and available nfts
 *  logic based on key to render out selected nft inside borrow module
 * @params none
 * @returns 3 nfts
*/
const marketNFTs = [
  {
    name: 'No open positions available',
    image:'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
    borrowApy: '0%',
    estValue: '0 SOL',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 1
  }
];

const newPositionPlaceholder = [
  {
    name: 'Please select an NFT',
    image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
    borrowAPY: '0',
    estValue: '$0',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 4,
  }
];
interface CollateralNFT {
  image: string,
  mint: PublicKey,
  name: string,
  symbol: string,
  updateAuthority: PublicKey,
  uri: string
}

const Loan: NextPage = () => {


  return (
    <Layout>
      <Box marginY="4">
        <Stack
          direction="horizontal"
          justify="space-between"
          wrap
          align="center"
        >
          <Box display="flex" alignSelf="center" justifySelf="center">
            <Link href="/loan" passHref>
              <Button
                size="small"
                variant="transparent"
                rel="noreferrer"
                prefix={<IconChevronLeft />}
              >
                Pools
              </Button>
            </Link>
          </Box>
        </Stack>
      </Box>
      <Box display="flex" height="full" className={styles.loanCardsContainer}>
        <LoanNFTsContainer
          selectedId={selectedId}
          handleBorrow={handleBorrowModal}
          buttons={[
            {
              title: 'Open positions',
              active: false,
            },
            {
              title: 'New position',
              active: true,
            }
          ]}
          openPositions={userCollateralPositions}
          onSelectNFT={selectNFT}
          nftArrayType={nftArrayType}
          availableNFTs={userAvailableNFTs}
          executeWithdrawNFT={executeWithdrawNFT}
          executeDepositNFT={executeDepositNFT}
          reFetchNFTs={reFetchNFTs}
          refreshPositions={refreshPositions}
          // set key equal to name since open positions doesnt contain id but name is with unique number
        />

        <Box>
          {
            borrowModal == 1 && collateralNFTPositions?.length ?
              <BorrowNFTsModule
                NFT={
                  collateralNFTPositions
                  &&
                  collateralNFTPositions.find((NFT) => NFT.name == selectedId) || defaultNFT[0]
                }
                mint={withDrawDepositNFT}
                loanPositions={loanPositions}
                executeWithdrawNFT={executeWithdrawNFT}
                executeBorrow={executeBorrow}
                executeRepay={executeRepay}
                honeyUser={honeyUser}
                openPositions={collateralNFTPositions}
                parsedReserves={parsedReserves}
                userAvailableNFTs={availableNFTs}
                userDebt={userDebt}
                userAllowance={userAllowance}
                loanToValue={loanToValue}
                fetchMarket={fetchMarket}
                liqidationThreshold={liqidationThreshold}
              />
            :
              <LoanNewBorrow
                NFT={
                  availableNFTs
                  &&
                  availableNFTs[0].find((NFT: any) => NFT.name == selectedId) || newPositionPlaceholder[0]
                }
                mint={withDrawDepositNFT}
                executeDepositNFT={executeDepositNFT}
                loanPositions={loanPositions}
                parsedReserves={parsedReserves}
                openPositions={collateralNFTPositions}
                userAvailableNFTs={availableNFTs}
                reFetchNFTs={reFetchNFTs}
                refreshPositions={refreshPositions}
                liqidationThreshold={liqidationThreshold}
              />
          }
        </Box>
      </Box>
    </Layout>
  );
};

export default Loan;