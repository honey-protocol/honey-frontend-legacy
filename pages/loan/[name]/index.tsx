import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import useFetchNFTByUser from '../../../hooks/useNFTV2';
import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { useBorrowPositions } from '@honey-finance/sdk/lib/hooks';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';

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
   * @description base sdk config object
   * @params none
   * @returns connection | wallet | jetID
  */
  const sdkConfig = {
    saberHqConnection: useConnection(),
    sdkWallet: useConnectedWallet(),
    honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
    // marketID: 'CqFM8kwwkkrwPTVFZh52yFNSaZ3kQPDADSobHeDEkdj3'
    marketID: 'HB82woFm5MrTx3X4gsRpVcUxtWJJyDBeT5xNGCUUrLLe'
  }

  const [openPositions, setOpenPositions] = useState()

  /**
   * @description calls upon useBorrowPositions
   * @params connection && wallet && JET ID
   * @returns TBorrowPosition array of data
  */
  const getBorrowPoistions = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet, sdkConfig.honeyId, sdkConfig.marketID);

  useEffect(() => {
    console.log('the borrowed positions', getBorrowPoistions);
  }, [getBorrowPoistions])

  const [selectedId, setSelectedId] = useState(1);
  
  /**
   * @description wip testing with fetching nft hook - for now no nfts in wallet
   * @params wallet
   * @returns array of nfts held by user in wallet
  */
  const wallet = useConnectedWallet();
  const availableNFTs = useFetchNFTByUser(wallet)

  console.log('the nft arr', availableNFTs)

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
          NFTs={getBorrowPoistions.data}
        />
        <BorrowNFTsModule NFT={marketNFTs.find(
          (NFT) => NFT.key === selectedId) || marketNFTs[0]} />
      </Box>
    </Layout>
  );
};

export default Loan;
