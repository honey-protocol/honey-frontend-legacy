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

/**
 * @description interface for NFT object
 * @params none
 * @returns typed object
*/
interface OpenObligation {
  address: PublicKey,
  debt: number,
  highest_bid: number,
  is_healthy: string,
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
  const [fetchedPositions, setFetchedPositions] = useState<Array<OpenObligation>>();
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState(0);

  const headerData = ['Position', 'Debt', 'LTV %', 'Health Factor', 'Address'];

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
  function handleBiddingState(biddingArray: any, positions: any) {
    biddingArray.map((obligation: any) => {
      if (obligation.bidder == stringyfiedWalletPK) {
        setHasPosition(true);
        setCurrentUserBid(Number(obligation.bidLimit / LAMPORTS_PER_SOL));
      }
    });

    let sorted = positions.sort((first: any,second: any) => first.is_healthy - second.is_healthy).reverse();
    let highestBid = positions.sort((first: any, second: any) => first.highest_bid - second.highest_bid);
    console.log('this is highestBid', highestBid[0]);
    
    setHighestBiddingAddress(new PublicKey(highestBid[0].address).toString());
    setHighestBiddingValue(highestBid[0].highest_bid / LAMPORTS_PER_SOL);
    setFetchedPositions(sorted);
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
      status.positions?.map((position) => {
        if (position.is_healthy == 'MEDIUM') {
          position.is_healthy = '0'
        } else if (position.is_healthy == 'LOW') {
          position.is_healthy = '1'
        } else if (position.is_healthy == 'RISKY') {
          position.is_healthy = '2'
        }
      });

      handleBiddingState(status.bids, status.positions);
    }
  }, [statusState]);

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
          if (!currentUserBid) return;
          console.log('revoke bid being called', currentUserBid);

          let transactionOutcome: any = await liquidatorClient.revokeBid({
            amount: currentUserBid,
            market: new PublicKey(HONEY_MARKET_ID),
            bidder: wallet.publicKey,
            bid_mint: NATIVE_MINT,
            withdraw_destination: wallet.publicKey
          });

          console.log('@@__Transaction_Outcome revoke bid:', transactionOutcome);
          // refreshDB();
          if (transactionOutcome[0] == 'SUCCESS') {
            toastResponse('SUCCESS', 'Revoke Bid', 'SUCCESS');
          } else {
            toastResponse('ERROR', 'Revoke failed', 'ERROR');
          }
        } else if (type == 'place_bid') {
            console.log('inside place bid', userBid)
            // if no user bid terminate action
            if (!userBid) return;
            console.log('place bid being called', userBid);

            let transactionOutcome: any = await liquidatorClient.placeBid({
              bid_limit: userBid,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT
            });

            console.log('@@__Transaction_Outcome place bid:', transactionOutcome);
            // refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
            } else {
              toastResponse('ERROR', 'Bid failed', 'ERROR');
            }

        } else if (type == 'increase_bid') {
            // if no user bid terminate action
            if (!userBid) return;
            console.log('increase bid being called');

            let transactionOutcome: any = await liquidatorClient.increaseBid({
              bid_increase: userBid,
              market: new PublicKey(HONEY_MARKET_ID),
              bidder: wallet.publicKey,
              bid_mint: NATIVE_MINT,
            });

            console.log('@@__Transaction_Outcome increase bid:', transactionOutcome);
            // refreshDB();
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
          console.log('The error:', error)
          return toastResponse('ERROR', 'Bid failed', 'ERROR');
        }
  }

  async function handleExecuteBid(type: string, userBid?: number) {
    console.log('running executeBid')
    await fetchLiquidatorClient(type, userBid!)
  }

  useEffect(() => {
    if (currentUserBid) console.log('this is currentUserBid', currentUserBid);
  }, [currentUserBid])

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
        <Box className={styles.biddingOverview}>
          <h4>Highest bid on collection: <span>{highestBiddingValue} SOL</span></h4>
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