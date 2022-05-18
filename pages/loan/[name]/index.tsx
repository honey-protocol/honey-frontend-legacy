import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { ConfigureSDK } from '../../../helpers/loanHelpers/index';
import useFetchNFTByUser from '../../../hooks/useNFT';
import LoanNewBorrow from 'components/NewPosition';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {TYPE_ZERO, TYPE_ONE} from '../../../constants/loan';
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
import { parse } from 'path';
import BN from 'bn.js';

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
    borrowApy: '4%',
    estValue: '2 SOL',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 1
  },
  {
    name: 'COFRE #574',
    image:'https://www.arweave.net/2XSva0NaalwsGBtxw-puVT_j1NDXecrMAGRxxvRjMK0?ext=png',
    borrowApy: '6.2%',
    estValue: '2 SOL',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 2
  },
  {
    name: 'Cofre #529',
    image: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    borrowAPY: '3.1',
    estValue: '2 SOL',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 3
  },
  {
    name: 'Please select an NFT',
    image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
    borrowAPY: '0',
    estValue: '$0',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 4,
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

  useEffect(() => {
  }, [honeyUser, honeyReserves, honeyClient]);
  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
  */
  const { market, marketReserveInfo, parsedReserves }  = useHoney();

  useEffect(() => {
    if (parsedReserves) {
      console.log('@@@@@@@@@ outstandingDebt-', ((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())/ LAMPORTS_PER_SOL));
    }
    console.log('market', market)
  }, [market, marketReserveInfo, parsedReserves]);

    /**
   * @description logic regarding borrow modal or lendmodal
   * @params 0 or 1
   * @returns sets state and renders appropriate modal
  */
     const [borrowModal, setBorrowModal] = useState(TYPE_ZERO);

     function handleBorrowModal(value: any) {
       value == TYPE_ONE ? setBorrowModal(TYPE_ONE) : setBorrowModal(TYPE_ZERO)
     }

  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params
   * @returns
   */
  let { loading, collateralNFTPositions, loanPositions, fungibleCollateralPosition, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)

  useEffect(() => {
    console.log('this is loan positions', loanPositions);
    if (collateralNFTPositions && collateralNFTPositions.length > TYPE_ZERO) setBorrowModal(TYPE_ONE)
  }, [collateralNFTPositions, loanPositions, fungibleCollateralPosition]);

  /**
   * @description fetched available nfts in the users wallet
   * @params wallet
   * @returns array of available nfts
  */
  const wallet = useConnectedWallet();
  let availableNFTs = useFetchNFTByUser(wallet);

  useEffect(() => {
  }, [availableNFTs]);

  const [withDrawDepositNFT, updateWithdrawDepositNFT] = useState();

  useEffect(() => {
  }, [withDrawDepositNFT]);

  /**
   * @description logic regarding selected nft for borrow module
   * @params key of nft
   * @returns sets state
  */
  const [selectedId, setSelectedId] = useState('1');
  const [nftArrayType, setNftArrayType] = useState(false);
  // state handler based off nft key
  function selectNFT(key: any, type: boolean) {
    console.log('this is the selected NFT', key, nftArrayType)
    setSelectedId(key.name);
    setNftArrayType(type);
    updateWithdrawDepositNFT(key.mint)
  };

  /**
   * @description executes the deposit NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
  */
  async function executeDepositNFT(mintID: any) {
    try {
      if (!mintID) return;
      const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
      console.log('updateAuthority', metadata.pubkey.toString());
      depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
    } catch (error) {
      console.log('error depositing nft', error);
      return;
    }

  }

  /**
   * @description executes the withdraw NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
  */
  async function executeWithdrawNFT(mintID: any) {
    try {
      if (!mintID) return;
      const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
      withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
    } catch (error) {
      console.log('error depositing nft', error);
      return;
    }
  }

  /**
   * @description
   * executes the borrow function which allows user to borrow against NFT
   * base value of NFT is 2 SOL - liquidation trashold is 50%, so max 1 SOL available
   * @params borrow amount
   * @returns borrowTx
  */
  async function executeBorrow() {
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, 1 * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);
    console.log('this is borrowTx', tx);
  }

  /**
   * @description
   * executes the repay function which allows user to repay their borrowed amount
   * against the NFT
   * @params amount of repay
   * @returns repayTx
  */
  async function executeRepay() {
    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, 1 * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
    console.log('this is repayTx', tx);
  }

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
              active: true,
            },
            {
              title: 'New position',
              active: false,
            }
          ]}
          openPositions={collateralNFTPositions}
          onSelectNFT={selectNFT}
          nftArrayType={nftArrayType}
          availableNFTs={availableNFTs[0]}
          executeWithdrawNFT={executeWithdrawNFT}
          executeDepositNFT={executeDepositNFT}
          // set key equal to name since open positions doesnt contain id but name is with unique number
        />

        <Box>
          {
            borrowModal == 1 ?
              <BorrowNFTsModule
                NFT={
                  collateralNFTPositions
                  &&
                  collateralNFTPositions.find((NFT) => NFT.name == selectedId) || marketNFTs[0]
                }
                mint={withDrawDepositNFT}
                loanPositions={loanPositions}
                executeWithdrawNFT={executeWithdrawNFT}
                executeBorrow={executeBorrow}
                executeRepay={executeRepay}
                honeyUser={honeyUser}
                openPositions={collateralNFTPositions}
                parsedReserves={parsedReserves}
              />
            :
              <LoanNewBorrow
                NFT={
                  availableNFTs
                  &&
                  availableNFTs[0].find((NFT) => NFT.name == selectedId) || marketNFTs[3]
                }
                mint={withDrawDepositNFT}
                executeDepositNFT={executeDepositNFT}
                loanPositions={loanPositions}
              />
          }
        </Box>
      </Box>
    </Layout>
  );
};

export default Loan;