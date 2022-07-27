import type { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, IconClose, Text, Avatar, IconWallet, IconChevronDown, IconChevronRight } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';
import { useConnectedWallet } from '@saberhq/use-solana';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationCard from 'components/LiquidationCard/LiquidationCard';
import { useAnchor, LiquidatorClient, useAllPositions } from '../../../../honey-sdk';
import { ConfigureSDK, toastResponse } from 'helpers/loanHelpers';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from '../../../constants/loan';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import LiquidationBiddingModal from 'components/LiquidationBiddingModal/LiquidationBiddingModal';
import { NATIVE_MINT } from '@solana/spl-token';
import axios from 'axios';

/**
 * @description interface for NFT object
 * @params none
 * @returns typed object
*/
interface OpenObligation {
  address: PublicKey,
  debt: number,
  highest_bid: number,
  is_healthy: boolean,
  ltv: number,
}

const LiquidationPool = () => {
  // init anchor
  const { program } = useAnchor();
  // create wallet instance for PK
  const wallet = useConnectedWallet();

  /**
    * @description sets program | market | connection | wallet
    * @params none
    * @returns connection with sdk
  */
  const sdkConfig = ConfigureSDK();
  /**
    * @description fetches open nft positions
    * @params connection | wallet | honeyprogramID | honeymarketID
    * @returns loading | nft positions | error
  */
   const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

  /**
    * @description the obligations that are being rendered
    * @params none
    * @returns obligations
   */
  const [fetchedPositions, setFetchedPositions] = useState<Array<OpenObligation>>([]);
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState(2);

  const headerData = ['Position', 'Debt', 'Address', 'LTV %', 'Health Factor', 'Highest Bid'];

  const [showBiddingModal, setBiddingModal] = useState(false);

  function handleShowBiddingModal() {
    showBiddingModal == false ? setBiddingModal(true) : setBiddingModal(false);
  }

  useEffect(() => {}, [showBiddingModal]);

  // create stringyfied instance of walletPK
  let stringyfiedWalletPK = sdkConfig.sdkWallet?.publicKey.toString();

  /**
   * @description sets the state if user has open bid
   * @params array of bids
   * @returns state change
  */
  function handleBiddingState(biddingArray: any) {
    biddingArray.map((obligation: any) => {
      if (obligation.bidder == stringyfiedWalletPK) {
        setHasPosition(true);
        console.log('@@@@@@@-----', obligation)
        setCurrentUserBid(obligation.highest_bid);
      }
    });

    let sorted = biddingArray.sort((first: any,second: any) => first.bidLimit - second.bidLimit).reverse();

    setHighestBiddingAddress(sorted[0].bidder);
    setHighestBiddingValue(sorted[0].bidLimit / LAMPORTS_PER_SOL);
  }

  const [statusState, setStatusState] = useState(false);

  /**
   * @description checks if there are positions, if so set state
   * @params none
   * @returns state positions && bids
  */
  useEffect(() => {
    if (status.positions) {
      setStatusState(true);
    }
  }, [status]);

  useEffect(() => {
    if (statusState == true) {
      setFetchedPositions(status.positions);
      handleBiddingState(status.bids);
    }
  }, [statusState]);

  function refreshDB() {
    axios.get('https://honey-nft-api.herokuapp.com/refresh_db')
    .then((result) => {
      console.log('DB refresh result:', result);
    })
  }

  /**
   * @description calls upon liquidator client for placebid | revokebid | increasebid
   * @params tpye | userbid | nftmint
   * @returms toastresponse of executed call
  */
  async function fetchLiquidatorClient(type: string, userBid?: number) {
    try {
      const liquidatorClient = await LiquidatorClient.connect(program.provider, HONEY_PROGRAM_ID, false);
      if (wallet) {
        if (type == 'revoke_bid') {
          console.log('revoke bid being called');

          if (!currentUserBid) return;

          let transactionOutcome: any = await liquidatorClient.revokeBid({
            amount: currentUserBid,
            market: new PublicKey(HONEY_MARKET_ID),
            bidder: wallet.publicKey,
            bid_mint: NATIVE_MINT,
            withdraw_destination: wallet.publicKey
          });

          console.log('@@__Transaction_Outcome revoke bid:', transactionOutcome);
          refreshDB();
          if (transactionOutcome[0] == 'SUCCESS') {
            toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
          } else {
            toastResponse('ERROR', 'Bid failed', 'ERROR');
          }
        } else if (type == 'place_bid') {
            console.log('place bid being called', userBid)
            let transactionOutcome: any = await liquidatorClient.placeBid({
              bid_limit: userBid || 7,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT
            });

            console.log('@@__Transaction_Outcome place bid:', transactionOutcome);
            refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
            } else {
              toastResponse('ERROR', 'Bid failed', 'ERROR');
            }

        } else if (type == 'increase_bid') {
            console.log('increase bid being called')
            let transactionOutcome: any = await liquidatorClient.increaseBid({
              bid_increase: userBid || 0,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT,
            });

            console.log('@@__Transaction_Outcome increase bid:', transactionOutcome);
            refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
            } else {
              toastResponse('ERROR', 'Bid failed', 'ERROR');
            }
          }
      } else {
          return;
        }
      } catch (error) {
          return toastResponse('ERROR', 'Bid failed', 'ERROR');
        }
  }

  /**
   * @params
   * @description
   * @returns
  */
  // interface PlaceBidParams {
  //   bid_limit: number;
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   deposit_source?: PublicKey;
  // }

  // interface IncreaseBidParams {
  //   bid_increase: number;
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   deposit_source?: PublicKey;
  // }

  // interface RevokeBidParams {
  //   amount: number;
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   withdraw_destination?: PublicKey;
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handleIncreaseBid(userBid: number, params: IncreaseBidParams) {
  //   fetchLiquidatorClient('increase_bid', {
  //     bid_increase: userBid,
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     deposit_source: PublicKey,
  //   })
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handleRevokeBid(params: RevokeBidParams) {
  //   fetchLiquidatorClient('revoke_bid', {
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     withdraw_destination: PublicKey
  //   });
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handlePlaceBid(userBid: number, params: PlaceBidParams) {
  //   fetchLiquidatorClient('place_bid', {
  //     bid_limit: userBid,
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     deposit_source: PublicKey
  //   })
  // }

  async function handleExecuteBid(type: string, userBid?: number) {
    await fetchLiquidatorClient(type, userBid!)
  }

  /**
   * @description validates if user has outstanding bid or not
   * @params none
   * @returns toastresponse with state of outstanding bid
  */
  function validatePositions() {
    hasPosition
    ?
    toastResponse('LIQUIDATION', '1 oustanding bid', 'LIQUIDATION')
    :
    toastResponse('LIQUIDATION', 'No outstanding bid', 'LIQUIDATION')
  }

  validatePositions();

  return (
    <Layout>
      <Stack>
        <Box>
          <Stack
            direction="horizontal"
            justify="space-between"
            wrap
            align="center"
          >
            <Box display="flex" alignSelf="center" justifySelf="center">
              <Link href="/liquidation" passHref>
                <Button
                  size="small"
                  variant="transparent"
                  rel="noreferrer"
                  prefix={<IconChevronLeft />}
                >
                  Liquidations
                </Button>
              </Link>
            </Box>
          </Stack>
        </Box>
        <Box className={styles.callToActionContainer}>
          <h2>Collection: <span>Honey Eyes</span></h2>
          {
            hasPosition
            ?
            <Button variant="primary" onClick={handleShowBiddingModal}>
              Review Bid
            </Button>
            :
            <Button variant="primary" onClick={handleShowBiddingModal}>
              Place Bid on Collection
            </Button>
          }
        </Box>
        <LiquidationHeader
            headerData={headerData}
          />
        <Box>
         {
            fetchedPositions && fetchedPositions.map((loan, index) => {
              return (
                // <LiquidationCard
                //   key={i}
                //   debt={loan.debt}
                //   address={loan.address}
                //   ltv={loan.ltv}
                //   isHealthy={loan.is_healthy}
                //   highestBid={loan.highest_bid}
                //   liquidationType={true}
                //   handleShowBiddingModal={handleShowBiddingModal}
                //   handleExecuteBid={() => handleExecuteBid}
                // />
                <LiquidationCard
                  key={index}
                  loan={loan}
                  liquidationType={true}
                  handleShowBiddingModal={handleShowBiddingModal}
                  handleExecuteBid={() => handleExecuteBid}
              />
            )
            })
          }
        </Box>
        <Box>
          {
            showBiddingModal && (
              <LiquidationBiddingModal
                handleShowBiddingModal={handleShowBiddingModal}
                handleExecuteBid={handleExecuteBid}
                hasPosition={hasPosition}
                stringyfiedWalletPK={stringyfiedWalletPK}
                highestBiddingAddress={highestBiddingAddress}
                highestBiddingValue={highestBiddingValue}
              />
            )
          }
        </Box>
      </Stack>
    </Layout>
  );
};

export default LiquidationPool;