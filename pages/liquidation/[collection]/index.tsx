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
import { useAnchor, LiquidatorClient, useAllPositions, NftPosition } from '@honey-finance/sdk';
import { ConfigureSDK, toastResponse } from 'helpers/loanHelpers';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from '../../../constants/loan';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import LiquidationBiddingModal from 'components/LiquidationBiddingModal/LiquidationBiddingModal';
import { NATIVE_MINT } from '@solana/spl-token';

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
  const [fetchedPositions, setFetchedPositions] = useState<Array<NftPosition>>();
  const [hasPosition, setHasPosition] = useState(false);
  const [highestBiddingAddress, setHighestBiddingAddress] = useState('');
  const [highestBiddingValue, setHighestBiddingValue] = useState(0);
  const [currentUserBid, setCurrentUserBid] = useState(0);

  const headerData = ['Position', 'Debt', 'Address', 'Health Factor'];

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
    let highestBid = biddingArray.sort((first: any, second: any) => first.bidLimit - second.bidLimit).reverse();
    // let highestBid = biddingArray.bidder || '';
    
    // console.log('Sorted Bidding Array:', highestBid);
    console.log('this is biddingArray', highestBid)
    console.log('this is sorted', sorted)

    // highestBid.map((obj:any) => {
    //   console.log(`bid: ${obj.highest_bid} owner: ${obj.owner.toString()}`);
    // });

    // setHighestBiddingAddress(highestBid[0].owner.toString());
    // setHighestBiddingValue(highestBid[0].highest_bid / LAMPORTS_PER_SOL);
    if (highestBid[0]) {
      setHighestBiddingAddress(highestBid[0].bidder);
      setHighestBiddingValue(highestBid[0].bidLimit / LAMPORTS_PER_SOL);
    }
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

    if (status.bids && status.positions) handleBiddingState(status.bids, status.positions);

    return;
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

    return;
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

          console.log('@@__Transaction_Outcome revoke bid:', transactionOutcome[0]);

          if (transactionOutcome[0] == 'SUCCESS') {
            return toastResponse('SUCCESS', 'Revoke Bid', 'SUCCESS');
          } else {
            return toastResponse('ERROR', 'Revoke failed', 'ERROR');
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

            console.log('@@__Transaction_Outcome place bid:', transactionOutcome[0]);
            // refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              return toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
            } else {
              return toastResponse('ERROR', 'Bid failed', 'ERROR');
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

            console.log('@@__Transaction_Outcome increase bid:', transactionOutcome[0]);
            // refreshDB();
            if (transactionOutcome[0] == 'SUCCESS') {
              return toastResponse('SUCCESS', 'Placed Bid', 'SUCCESS');
            } else {
              return toastResponse('ERROR', 'Bid failed', 'ERROR');
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
  /**
   * @description changes state of bidding modal | inits fetchLiq. func
   * @params type, being type of bid | userbid being the amount, is optional |
   * @returns inits fetchLiq. func
  */
  async function handleExecuteBid(type: string, userBid?: number) {
    console.log('running executeBid')
    handleShowBiddingModal();
    await fetchLiquidatorClient(type, userBid!)
  }

  useEffect(() => {}, [currentUserBid]);

  function handleRefetch() {
    console.log('handle refetch initialized');
    setTimeout(async () => {
      console.log('handle refetch running');
      if (status) {
        status.fetchPositions().then(() => {
          console.log('updated statusObject', status);
        })
      }
    }, 60000)
  }

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
          <h4>
            Highest bid on collection: <span>{highestBiddingValue} SOL </span><br /> 
            <span>by account: <a target="_blank" rel="noreferrer" href={`https://solscan.io/account/${highestBiddingAddress}`}>{highestBiddingAddress?.substring(0, 6)}..</a></span>
          </h4>
        </Box>
        {
          fetchedPositions?.length &&
          <Box className={styles.biddingOverview}>
            <h4>Loan to value ratio <span>{fetchedPositions[0].ltv}%</span></h4>
          </Box>
        }
        <LiquidationHeader
            headerData={headerData}
          />
        <Box>
         {
            fetchedPositions && fetchedPositions.map((loan, i) => {
              return (
                <LiquidationCard
                  index={i}
                  key={i}
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
                highestBiddingAddress={highestBiddingAddress}
                highestBiddingValue={highestBiddingValue}
                handleRefetch={handleRefetch}
              />
            )
          }
        </Box>
      </Stack>
    </Layout>
  );
};

export default LiquidationPool;