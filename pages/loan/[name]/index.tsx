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
import * as BL from '@solana/buffer-layout';
import {toastResponse, BnToDecimal, asyncTimeout} from '../../../helpers/loanHelpers/index';
import {
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  useHoney,
  borrow,
  repay,
  ObligationAccount,
  numberField,
  u64Field,
  i64Field,
  ReserveStateLayout,
  HoneyReserve,
} from '@honey-finance/sdk';
import { RoundHalfDown } from 'helpers/utils';
import {
  parseMappingData,
  parsePriceData,
  parseProductData,
  PythHttpClient
} from "@pythnetwork/client";
import { toast } from 'react-toastify';
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
  /**
   * @description calls upon sdk config object
   * @params none
   * @returns connection | wallet | honeyID | marketID
  */
  const sdkConfig = ConfigureSDK();
  /**
   * @description
   * @params
   * @returns
  */
  const [userLoanPositions, setUserLoanPositions] = useState(0);
  const [userAvailableNFTs, setUserAvailableNFTs] = useState([]);
  const [userCollateralPositions, setUserCollateralPositions] = useState<{}>();
  const [userDebt, setUserDebt] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  const [defaultNFT, setDefaultNFT] = useState<Array<CollateralNFT>>([]);
  const [globalLoadingState, setGlobalLoadingState] = useState(false);

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
  const { market, marketReserveInfo, parsedReserves, fetchMarket }  = useHoney();

  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params none
   * @returns collateralNFTPositions | loanPositions | fungibleCollateralPosition | loading | error
   */
   let { loading, collateralNFTPositions, loanPositions, fungibleCollateralPosition, refreshPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

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
  const [depositNoteExchangeRate, setDepositNoteExchangeRate] = useState(0);
  const [nftPrice, setNFTPrice] = useState(0);
  const [cRatio, setCRatio] = useState(0);



  // let depositNoteExchangeRate = 0
  // , loanNoteExchangeRate = 0
  // , nftPrice = 0
  // , cRatio = 1;


  async function handleLoanInit() {
    if (marketReserveInfo) {
      setNFTPrice(marketReserveInfo[0].price.div(new BN(10 ** 15)).toNumber());
      setDepositNoteExchangeRate(BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5))
      setCRatio(BnToDecimal(marketReserveInfo[0].minCollateralRatio, 15, 5))
    }
  }

  function handleLoanValues() {
    if (honeyUser?.loans().length > 0 && marketReserveInfo) {
      let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);
      let userLoans = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL;
      let sumOfAllowance = RoundHalfDown(nftCollateralValue / cRatio - userLoans, 2);
      setUserAllowance(sumOfAllowance);
  
      const totalDebt = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL;
      const lvt = totalDebt / nftPrice;

      setUserDebt(totalDebt);
      setLoanToValue(lvt);
    }
  }

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
  useEffect(() => {
    if (collateralNFTPositions) setDefaultNFT(collateralNFTPositions);

    // setTimeout(() => {
      // needs to be separated 
      // const fetchAsyncData = async() => {
      //   if (honeyUser && honeyUser.getObligationData) {
      //     // let obligation = await honeyUser?.getObligationData() as ObligationAccount;
      //   }
      // }

      // fetchAsyncData();

      // let depositNoteExchangeRate = 0
      // , loanNoteExchangeRate = 0
      // , nftPrice = 0
      // , cRatio = 1;
      

    //   if(marketReserveInfo) {
    //     console.log('@@@@@MARKET RESERV NFT PRICEE@@@@@@')
    //     nftPrice = 2;
    //     depositNoteExchangeRate = marketReserveInfo[0].depositNoteExchangeRate.div(new BN(10 ** 15)).toNumber();
    //     // depositNoteExchangeRate = BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5);
    //     loanNoteExchangeRate = marketReserveInfo[0].loanNoteExchangeRate.div(new BN(10 ** 10)).toNumber() / (10 ** 5);
    //     cRatio = marketReserveInfo[0].minCollateralRatio.div(new BN(10 ** 10)).toNumber() / (10 ** 5);
    //   }

    //   if (honeyUser?.loans().length > 0) {
    //     let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);
    //     let userLoans = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));

    //     let sumOfAllowance = nftCollateralValue / cRatio - userLoans;
    //     if (sumOfAllowance > 0) sumOfAllowance = sumOfAllowance * 0.6;
    //     setUserAllowance(sumOfAllowance);

    //     const totalDebt = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));
    //     const lvt = totalDebt / nftPrice;
        
    //     setUserDebt(totalDebt);
    //     setLoanToValue(lvt);
    //   }
    // }, 3000);

    if (marketReserveInfo) handleLoanInit(); 
    if (honeyUser?.loans().length > 0) handleLoanValues();

  }, [marketReserveInfo, honeyUser, collateralNFTPositions, market, error, parsedReserves]);

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
    if (loanPositions?.length) setUserLoanPositions(loanPositions[0].amount);
    // validate if collateralNFTPositions
    if (collateralNFTPositions && collateralNFTPositions.length > TYPE_ZERO) setBorrowModal(TYPE_ONE);

    setUserCollateralPositions(collateralNFTPositions);
  }, [collateralNFTPositions, loanPositions, fungibleCollateralPosition, error, globalLoadingState]);

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

  useEffect(() => {
    toastResponse('LOADING', 'Loading..', 'LOADING');
  }, [loading]);

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
        const tx = await depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
        if (tx[0] == 'SUCCESS') {
          toastResponse('SUCCESS', 'Deposit success', 'SUCCESS');
          console.log('firing')
          await refreshPositions();

          reFetchNFTs({})
        }
      } catch (error) {
        console.log('error depositing nft', error);
        return toastResponse('ERROR', 'Error deposit NFT', 'ERROR');
    }
  }

  /**
   * @description executes the withdraw NFT func. from SDK
   * @params mint of the NFT
   * @returns succes | failure
  */
  async function executeWithdrawNFT(mintID: any) {
    try {
      if (!mintID) return toastResponse('ERROR', 'Please select NFT', 'ERROR');
      const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
      const tx = await withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);

      if (tx[0] == 'SUCCESS') {
        await toastResponse('SUCCESS', 'Withdraw success', 'SUCCESS');
        console.log('firing')
        reFetchNFTs({});
        await refreshPositions();

      }
    } catch (error) {
      console.log('error depositing nft', error);
      toastResponse('ERROR', 'Error withdraw NFT', 'ERROR');
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
    if (!val) return toastResponse('ERROR', 'Please provide a value', 'ERROR');
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, val * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);
    console.log('borrowed amount', val * LAMPORTS_PER_SOL);
    if (tx[0] == 'SUCCESS') {
      toastResponse('SUCCESS', 'Borrow success', 'SUCCESS', 'BORROW');
    }
  }

  /**
   * @description
   * executes the repay function which allows user to repay their borrowed amount
   * against the NFT
   * @params amount of repay
   * @returns repayTx
  */
  async function executeRepay(val: any) {
    if (!val) return toastResponse('ERROR', 'Please provide a value', 'ERROR');
    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, val * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
    console.log('this is repayTx', tx);
    if (tx[0] == 'SUCCESS') {
      toastResponse('SUCCESS', 'Repay success', 'SUCCESS', 'REPAY');
    }
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
              />
          }
        </Box>
      </Box>
    </Layout>
  );
};

export default Loan;