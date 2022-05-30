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
import useFetchNFTByUser from '../../../hooks/useNFTV2';
import LoanNewBorrow from 'components/NewPosition';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {TYPE_ZERO, TYPE_ONE} from '../../../constants/loan';
import BN from 'bn.js';
import {
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  useHoney,
  borrow,
  repay,
} from '@honey-finance/sdk';

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

  const [depositNoteExRate, setDepositNoteExRate] = useState(0);
  const [loanNoteExRate, setLoanNoteExRate] = useState(0);
  const [userLoanPositions, setUserLoanPositions] = useState(0);
  const [userAvailableNFTs, setUserAvailableNFTs] = useState([]);
  const [userCollateralPositions, setUserCollateralPositions] = useState<{}>();
  const [userDebt, setUserDebt] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);

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
  
  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params none
   * @returns collateralNFTPositions | loanPositions | fungibleCollateralPosition | loading | error
   */
   let { loading, collateralNFTPositions, loanPositions, fungibleCollateralPosition, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

  /**
   * @description fetched available nfts in the users wallet
   * @params wallet
   * @returns array of available nfts
  */
  const wallet = useConnectedWallet();
  let availableNFTs: any = useFetchNFTByUser(wallet);
  // re-fetch function to force update
  let reFetchNFTs = availableNFTs[2];
  
  /**
   * @description sets default state for withDrawDepositNFT
   * @params mint of nft
   * @returns withDrawDepositNFT
  */
  const [withDrawDepositNFT, updateWithdrawDepositNFT] = useState('');

  /**
   * @description logic regarding selected nft for borrow module
   * @params key of nft
   * @returns sets state
  */
  const [selectedId, setSelectedId] = useState('1');
  const [nftArrayType, setNftArrayType] = useState(false);

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
  useEffect(() => {
    setTimeout(() => {
    if (honeyUser?.loans().length && marketReserveInfo) {
      const totalDebt = (marketReserveInfo[0]?.loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount)?.div(new BN(10 ** 15))).toNumber() / (10 ** 9);
      setUserDebt(totalDebt);
    }

    if( honeyUser?.deposits().length && marketReserveInfo) {
      const totalDeposit = ( marketReserveInfo[0].depositNoteExchangeRate.mul(honeyUser?.deposits()[0].amount).div(new BN(10 ** 15))).toNumber() / (10 ** 9);
      setUserTotalDeposits(totalDeposit);
      console.log('@@__total-deposits__@@', userTotalDeposits);
    }
    }, 2000);

  }, [marketReserveInfo, honeyUser]);

  useEffect(() => {
    setTimeout(() => {
      if (marketReserveInfo && honeyUser?.deposits()[0]) {
        // let depositNoteExRate = marketReserveInfo[0].depositNoteExchangeRate.div(new BN(10 ** 15)).toNumber();
        // let userDeposits = honeyUser.deposits()[0].amount.div(new BN(10 ** 9)).toNumber() * depositNoteExRate;
        let nftCollateralValue = marketReserveInfo[0].price.div(new BN(10 ** 15)).toNumber() * (collateralNFTPositions?.length || 0);
        let loanNoteExRate = marketReserveInfo[0].loanNoteExchangeRate.div(new BN(10 ** 15)).toNumber();
        let userLoans = honeyUser.loans()[0].amount.div(new BN(10 ** 9)).toNumber() * loanNoteExRate;
        let sumOfAllowance = nftCollateralValue - userLoans;
        
        setUserAllowance(sumOfAllowance)
      }
    }, 3000);
  }, [marketReserveInfo, honeyUser, collateralNFTPositions, reFetchNFTs]);

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
   * @description updates collateralNFTPositions | loanPositions | fungibleCollateralPosition
   * @params none
   * @returns collateralNFTPositions | loanPositions | fungibleCollateralPosition
  */
  useEffect(() => {
    // validate if loanpositions and amount
    if (loanPositions && loanPositions[0].amount) setUserLoanPositions(loanPositions[0].amount);
    // validate if collateralNFTPositions
    if (collateralNFTPositions && collateralNFTPositions.length > TYPE_ZERO) setBorrowModal(TYPE_ONE);
    
    console.log('collateral positions updated', collateralNFTPositions);
    setUserCollateralPositions(collateralNFTPositions);
  }, [collateralNFTPositions, loanPositions, fungibleCollateralPosition]);

  /**
   * @description updates availableNFTs | reFetchNFTs
   * @params none
   * @returns availableNFTs | reFetchNFTs
  */
  useEffect(() => {
    setUserAvailableNFTs(availableNFTs[0]);
  }, [availableNFTs]);

  /**
   * @description updates withDrawDepositNFT
   * @params none
   * @returns withDrawDepositNFT
  */
  useEffect(() => {
  }, [withDrawDepositNFT]);
  
  // state handler based off nft key
  function selectNFT(key: any, type: boolean) {
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
      console.log('current nfts', availableNFTs[0])
      const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
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
  async function executeBorrow(val: any) {
    if (!val) val = 1;
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, val * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);
    console.log('this is borrowTx', tx);
  }

  /**
   * @description
   * executes the repay function which allows user to repay their borrowed amount
   * against the NFT
   * @params amount of repay
   * @returns repayTx
  */
  async function executeRepay(val: any) {
    if (!val) val = 1;
    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, val * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
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
          openPositions={userCollateralPositions}
          onSelectNFT={selectNFT}
          nftArrayType={nftArrayType}
          availableNFTs={userAvailableNFTs}
          executeWithdrawNFT={executeWithdrawNFT}
          executeDepositNFT={executeDepositNFT}
          reFetchNFTs={reFetchNFTs}
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
                userAvailableNFTs={availableNFTs}
                userDebt={userDebt}
                userAllowance={userAllowance}
              />
            :
              <LoanNewBorrow
                NFT={
                  availableNFTs
                  &&
                  availableNFTs[0].find((NFT: any) => NFT.name == selectedId) || marketNFTs[3]
                }
                mint={withDrawDepositNFT}
                executeDepositNFT={executeDepositNFT}
                loanPositions={loanPositions}
                parsedReserves={parsedReserves}
                openPositions={collateralNFTPositions}
                userAvailableNFTs={availableNFTs}
                reFetchNFTs={reFetchNFTs}
              />
          }
        </Box>
      </Box>
    </Layout>
  );
};

export default Loan;