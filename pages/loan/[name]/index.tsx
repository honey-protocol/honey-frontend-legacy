import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import { useConnectedWallet } from '@saberhq/use-solana';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { ConfigureSDK } from '../../../helpers/loanHelpers/index';
import useFetchNFTByUser from '../../../hooks/useNFT';
import {
  deposit,
  HoneyUser,
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  usePools,
  useHoney,
  withdraw,
  borrow,
  repay,
} from '@honey-finance/sdk';

const marketNFTs = [
  {
    name: 'SMB #2721',
    image:'/nfts/2721.png',
    borrowApy: '4.2%',
    estValue: '$25,800',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 1
  },
  {
    name: 'SMB #273',
    image:'/nfts/273.png',
    borrowApy: '4.2%',
    estValue: '$23,500',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 2
  },
  {
    name: 'SMB #1912',
    image:'/nfts/1912.png',
    borrowApy: '4.2%',
    estValue: '$55,000',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 3
  },
  {
    name: 'SMB #2738',
    image:'/nfts/2738.png',
    borrowApy: '4.2%',
    estValue: '$33,300',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 4
  },
  {
    name: 'SMB #3956',
    image:'/nfts/3956.png',
    borrowApy: '4.2%',
    estValue: '$39,500',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 5
  }
]

const Loan: NextPage = () => {
  /**
   * @description calls upon sdk config object
   * @params none
   * @returns connection | wallet | honeyID | marketID
  */
  const sdkConfig = ConfigureSDK();
  
  /**
  * @description calls upon the honey sdk 
  * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
  * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
  */
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  /**
   * @description calls upon markets which 
   * @params none
   * @returns market | market reserve information | parsed reserves |
  */
  const { market, marketReserveInfo, parsedReserves }  = useHoney();
     
  useEffect(() => {
  }, [honeyUser, honeyReserves]);
  
  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params
   * @returns
   */  
  let { loading, collateralNFTPositions, loanPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)
       
  useEffect(() => {
  }, [collateralNFTPositions, loanPositions]);
     
  /**
   * @description fetched available nfts in the users wallet
   * @params wallet 
   * @returns array of available nfts
  */
  const wallet = useConnectedWallet();
  let availableNFTs = useFetchNFTByUser(wallet);
     
  useEffect(() => {
  }, [availableNFTs])

  /**
   * @description logic regarding selected nft for borrow module 
   * @params key of nft
   * @returns sets state
  */
  const [selectedId, setSelectedId] = useState(1);

  function selectNFT(key: number) {
    setSelectedId(key);
  };

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
          title="Open positions"
          selectedId={selectedId}
          onSelectNFT={selectNFT}
          buttons={[
            {
              title: 'New position',
            }
          ]}
          openPositions={collateralNFTPositions}
          availableNFTs={availableNFTs[0]}

        />
        <BorrowNFTsModule NFT={marketNFTs.find(
          (NFT) => NFT.key === selectedId) || marketNFTs[0]} />
      </Box>
    </Layout>
  );
};

export default Loan;