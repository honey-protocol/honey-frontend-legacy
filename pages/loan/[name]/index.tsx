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
import useFetchNFTByUser from '../../../hooks/useNFTV2';
import LoanNewBorrow from 'components/NewPosition';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {TYPE_ZERO, TYPE_ONE, LTV} from '../../../constants/loan';
import BN from 'bn.js';
import { BnDivided } from '../../../helpers/loanHelpers/index';
import {toastResponse, BnToDecimal, asyncTimeout, getNftPrice, ConfigureSDK} from '../../../helpers/loanHelpers/index';
import {
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  useHoney,
  borrow,
  repay,
  Reserve,
  ObligationAccount,
  numberField,
  u64Field,
  i64Field,
  ReserveStateLayout,
  HoneyReserve
// } from '@honey-finance/sdk';
} from '../../../../honey-sdk';

import { RoundHalfDown } from 'helpers/utils';
import {
  parseMappingData,
  parsePriceData,
  parseProductData,
  PythHttpClient
} from "@pythnetwork/client";
import { toast } from 'react-toastify';
import { Connection } from '@metaplex/js';
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
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [liqidationThreshold, setLiquidationThreshold] = useState(0);

  /**
  * @description calls upon the honey sdk
  * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
  * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
  */
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

  // const {sendRefreshTx} = new HoneyReserve(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)
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

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
  useEffect(() => {
    if (collateralNFTPositions) setDefaultNFT(collateralNFTPositions);

    if (marketReserveInfo && parsedReserves) {
      let testPrice = getNftPrice('devnet', sdkConfig.saberHqConnection, parsedReserves[0].switchboardPriceAggregator);
      console.log('this is test nft price switchboard', testPrice);
        setNFTPrice(2);
        setDepositNoteExchangeRate(BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5))
        setCRatio(BnToDecimal(marketReserveInfo[0].minCollateralRatio, 15, 5))
      }

      let userLoans = 0, totalDebt = 0;
      let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);

    if (honeyUser?.loans().length > 0) {
      if (honeyUser?.loans().length > 0 && marketReserveInfo) {
        userLoans = BnDivided(marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount), 10, 15) * 1.002 / LAMPORTS_PER_SOL;
        // userLoans = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() * 1.002 / LAMPORTS_PER_SOL;
        totalDebt = BnDivided(marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount), 10, 15) / LAMPORTS_PER_SOL;
        // totalDebt = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL;
      }
    }
    const lvt = totalDebt / nftPrice;

    let sumOfAllowance = RoundHalfDown(nftCollateralValue * LTV - userLoans, 4);
    sumOfAllowance < 0 ? setUserAllowance(0) : setUserAllowance(RoundHalfDown(sumOfAllowance));
    setUserDebt(RoundHalfDown(totalDebt));
    setLoanToValue(RoundHalfDown(lvt));

    // let liquidationThresh = 1 / cRatio * 100;
    setLiquidationThreshold(1 / cRatio * 100);
  }, [marketReserveInfo, honeyUser, collateralNFTPositions, market, error, parsedReserves, honeyReserves, cRatio, nftPrice, reserveHoneyState]);

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

        const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mintID);
        const tx = await depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
        if (tx[0] == 'SUCCESS') {
          toastResponse('SUCCESS', 'Deposit success', 'SUCCESS');

          await refreshPositions();

          reFetchNFTs({});
        }
      } catch (error) {
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
        reFetchNFTs({});
        await refreshPositions();

      }
    } catch (error) {
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
    try {
      if (!val) return toastResponse('ERROR', 'Please provide a value', 'ERROR');
      if (val == 1.6) val = val - 0.01;
      const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await borrow(honeyUser, val * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);

      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Borrow success', 'SUCCESS', 'BORROW');

        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
          return toastResponse('ERROR', 'Borrow failed', 'BORROW');
      }
    } catch (error) {
        return toastResponse('ERROR', 'An error occurred', 'BORROW');
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
    try {
      if (!val) return toastResponse('ERROR', 'Please provide a value', 'ERROR');
      const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await repay(honeyUser, val * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)

      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Repay success', 'SUCCESS', 'REPAY');
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
        return toastResponse('ERROR', 'Repay failed', 'REPAY')
      }
    } catch (error) {
      return toastResponse('ERROR', 'An error occurred', 'REPAY');
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

        <Box className={styles.flexContainer}>
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