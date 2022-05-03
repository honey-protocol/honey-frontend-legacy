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
import Nft from 'pages/farm/[name]';
/**
 * @description 
 *  static nft object based off current posted as collateral and available nfts
 *  logic based on key to render out selected nft inside borrow module
 * @params none
 * @returns 3 nfts
*/
const marketNFTs = [
  {
    name: 'COFRE #573',
    image:'https://www.arweave.net/sHPeuSwbrN3SNBwcn8OZjV_VYVp3TlONXduzyqpoXb8?ext=png',
    borrowApy: '4.2%',
    estValue: '$25,800',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 1
  },
  {
    name: 'COFRE #574',
    image:'https://www.arweave.net/2XSva0NaalwsGBtxw-puVT_j1NDXecrMAGRxxvRjMK0?ext=png',
    borrowApy: '6.2%',
    estValue: '$33,500',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 2
  },
  {
    name: 'Cofre #529',
    image: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    borrowAPY: '3.1',
    estValue: '$21.991',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 3
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
    console.log('this is collateralNFTs', collateralNFTPositions)
  }, [collateralNFTPositions, loanPositions]);
     
  /**
   * @description fetched available nfts in the users wallet
   * @params wallet 
   * @returns array of available nfts
  */
  const wallet = useConnectedWallet();
  let availableNFTs = useFetchNFTByUser(wallet);
     
  useEffect(() => {
    console.log('this is available NFTs', availableNFTs)
  }, [availableNFTs])

  /**
   * @description logic regarding selected nft for borrow module 
   * @params key of nft
   * @returns sets state
  */
  const [selectedId, setSelectedId] = useState(1);
  const [nftArrayType, setNftArrayType] = useState(false);
  // state handler based off nft key
  function selectNFT(key: any, type: boolean) {
    console.log('this is the key', key)
    setSelectedId(key);
    setNftArrayType(type);
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
          selectedId={selectedId}
          onSelectNFT={selectNFT}
          buttons={[
            {
              title: 'Open positions',
              active: true,
            },
            {
              title: 'New position',
              active: false,
            }
          ]}
          openPositions={collateralNFTPositions}
          availableNFTs={availableNFTs[0]}
          // set key equal to name since open positions doesnt contain id but name is with unique number
        />
        <BorrowNFTsModule 
          NFT={collateralNFTPositions && collateralNFTPositions.find((NFT) => NFT.name == selectedId) || marketNFTs[0]} />
      </Box>
    </Layout>
  );
};

// NFT={collateralNFTPositions && availableNFTs ? 
//   if (nftArrayType == false) {
//     collateralNFTPositions.find((NFT) => NFT.name == selectedId)
//   } else {
//     availableNFTs.find((NFT) => NFT.name == selectedId)
//   } : marketNFTs[0]
// }

export default Loan;