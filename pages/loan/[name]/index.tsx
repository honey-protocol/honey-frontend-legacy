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
import {toastResponse} from '../../../helpers/loanHelpers/index';
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
} from '@honey-finance/sdk';
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
  const { market, marketReserveInfo, parsedReserves }  = useHoney();

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

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
  useEffect(() => {
    if (collateralNFTPositions) setDefaultNFT(collateralNFTPositions);

    setTimeout(() => {
    // needs to be separated 
    const fetchAsyncData = async() => {
      let obligation = await honeyUser?.getObligationData() as ObligationAccount;
      // console.log('obligationData', obligation);
      // const Cached = BL.struct([
      //   i64Field('accruedUntil'),
      //   numberField('outstandingDebt'),
      //   numberField('uncollectedFees'),
      //   numberField('protocolUncollectedFees'),
      //   u64Field('totalDeposits'),
      //   u64Field('totalDepositNotes'),
      //   u64Field('totalLoanNotes'),
      //   BL.blob(416, '_UNUSED_0_'),
      //   u64Field('lastUpdated'),
      //   BL.u8('invalidated'),
      //   BL.blob(7, '_UNUSED_1_'),
      // ]);

    }
    fetchAsyncData();
    // if (error) toastResponse('ERROR', `An error occurred ${error}`);
      // console.log('honeyUser?.loans()', honeyUser?.loans());
      // console.log('honeyUser?.deposits()', honeyUser?.deposits());
      // console.log('collateralNFTPositions', collateralNFTPositions);
      // console.log('market', market);
      let depositNoteExchangeRate = 0
      , loanNoteExchangeRate = 0
      , nftPrice = 0
      , cRatio = 1;
      
      if(marketReserveInfo) {
        // nftPrice = marketReserveInfo[0].price.div(new BN(10 ** 15)).toNumber();
        nftPrice = 2;
        depositNoteExchangeRate = marketReserveInfo[0].depositNoteExchangeRate.div(new BN(10 ** 15)).toNumber();
        loanNoteExchangeRate = marketReserveInfo[0].loanNoteExchangeRate.div(new BN(10 ** 10)).toNumber() / (10 ** 5);
        cRatio = marketReserveInfo[0].minCollateralRatio.div(new BN(10 ** 10)).toNumber() / (10 ** 5);

        // console.log('marketReserveInfo[0]', marketReserveInfo[0]);
        // console.log('nftPrice', nftPrice);
        // console.log('depositNoteExRate', depositNoteExchangeRate);
        // console.log('loanNoteExRate', loanNoteExchangeRate);
        // console.log('cRatio', cRatio);
      }
      if (honeyUser?.loans().length > 0) {
        let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);
        let userLoans = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));

        let sumOfAllowance = nftCollateralValue / cRatio - userLoans;
        console.log('BEFORE', sumOfAllowance)
        if (sumOfAllowance > 0) sumOfAllowance = sumOfAllowance * 0.6;
        console.log('AFTER', sumOfAllowance)
        setUserAllowance(sumOfAllowance);

        const totalDebt = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));
        const lvt = totalDebt / nftPrice;
        
        setUserDebt(totalDebt);
        setLoanToValue(lvt);
      }
      // reFetchNFTs({});
    }, 3000);
  }, [marketReserveInfo, honeyUser, collateralNFTPositions, reFetchNFTs, market, error]);



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
  }, [loading])

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
        toastResponse('ERROR', 'Error deposit NFT', 'ERROR');
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
      if (!mintID) return toastResponse('ERROR', 'No NFT was provided', 'ERROR');
      const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
      withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
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
      toastResponse('SUCCESS', 'Borrow success', 'SUCCESS');
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
      toastResponse('SUCCESS', 'Repay success', 'SUCCESS');
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