import type { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  IconChevronLeft,
  Text,
  Avatar,
  Input,
  Spinner
} from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';
import { useConnectedWallet } from '@saberhq/use-solana';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationCard from 'components/LiquidationCard/LiquidationCard';
import { useAnchor, LiquidatorClient, useAllPositions, NftPosition } from '@honey-finance/sdk';
import { ConfigureSDK, toastResponse } from 'helpers/loanHelpers';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from '../../../constants/loan';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import VerifiedIcon from 'icons/VerifiedIcon';
import SolanaIcon from 'icons/SolanaIcon';
import { formatAddress } from 'helpers/addressUtils';
import NextNProgress from 'nextjs-progressbar';

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
  const [userInput, setUserInput] = useState(0);
  const [loadingState, setLoadingState] = useState(false);

  const headerData = ['Position', 'Debt', 'Address', 'Health Factor'];
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

    console.log('this is biddingArray', highestBid)
    console.log('this is sorted', sorted)

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

      // handleBiddingState(status.bids, status.positions);
      if (status.bids && status.positions) handleBiddingState(status.bids, status.positions);
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
            return toastResponse('SUCCESS', 'Bid revoked, fetching chain data', 'SUCCESS');
          } else {
            return toastResponse('ERROR', 'Revoke bid failed', 'ERROR');
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
              return toastResponse('SUCCESS', 'Bid placed, fetching chain data', 'SUCCESS');
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
              return toastResponse('SUCCESS', 'Bid increased, fetching chain data', 'SUCCESS');
            } else {
              return toastResponse('ERROR', 'Bid increase failed', 'ERROR');
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
    console.log('running executeBid, this is curr user bid', userBid);
    if (!userBid && type != 'revoke_bid') return console.log('no user input');
    handleRefetch();
    await fetchLiquidatorClient(type, userBid!);
  }

  useEffect(() => {}, [currentUserBid]);


  function handleRefetch() {
    console.log('handle refetch initialized');
    setLoadingState(true);

    setTimeout(async () => {
      console.log('handle refetch running');
      setLoadingState(false);

      if (status) {
        status.fetchPositions().then(() => {
          console.log('updated statusObject', status);
          return toastResponse('SUCCESS', 'Chain data fetched', 'SUCCESS');
        })
      }
    }, 70000)
  }

  function handleUserInput(val: any) {
    if (val.target.value.includes(',')) {
      let formatNumber = val.target.value.replace(',', '.') 
      setUserInput(formatNumber);
    } else {
      setUserInput(val.target.value);
    }
  }

  return (
    <Layout>
      <Stack>
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
        {/* COLLECTION LIQUIDATION DETAILS */}
        <Box
          backgroundColor="background"
          paddingX="5"
          paddingY="7"
          borderRadius="2xLarge"
        >
          <Stack
            direction="horizontal"
            justify="space-between"
            wrap
            align="center"
            space={{ xs: '10', md: 'none' }}
          >
            <Stack
              wrap
              direction="horizontal"
              space="5"
              justify={{ xs: 'center', md: 'flex-start' }}
              align="center"
            >
              <Box paddingX={{ xs: '10', md: 'none' }}>
              <Avatar
                size={{ xs: 'full', sm: '32' }}
                label="Honey eyes"
                shape="square"
                src="https://hwhm5h2hx7widk46v6fn6763c2palrfr2f6zzjfxsefgb4kp5jta.arweave.net/PY7On0e_7IGrnq-K33_bFp4FxLHRfZykt5EKYPFP6mY"
              />
              </Box>
              <Stack space="5">
                <Stack direction="horizontal" align="center">
                  <Text size="extraLarge" weight="bold" color="textPrimary">
                    Honey Genesis Bees
                  </Text>
                  <VerifiedIcon />
                </Stack>
                <Stack
                  justify="space-between"
                  space="10"
                  direction="horizontal"
                >
                  <Stack space="1" align={{ xs: 'center', md: 'flex-start' }}>
                    <Text weight="semiBold" color="textSecondary">
                      Highest bid
                    </Text>
                    <Stack direction="horizontal" align="center" space="2">
                      <Text
                        weight="semiBold"
                        size="extraLarge"
                        color="textPrimary"
                      >
                        {highestBiddingValue.toFixed(2)}
                      </Text>
                      <SolanaIcon />
                    </Stack>
                  </Stack>
                  <Stack space="1" align={{ xs: 'center', md: 'flex-start' }}>
                    <Text weight="semiBold" color="textSecondary">
                      Held by
                    </Text>
                    <Text
                      weight="semiBold"
                      size="extraLarge"
                      color="textPrimary"
                    >
                      {formatAddress(highestBiddingAddress)}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
          </Stack>

            <Stack>
              {hasPosition ? (
                <Stack align="flex-end">
                  <Stack direction="horizontal" space="2">
                    <Text>
                      Min bid: {(highestBiddingValue * 1.1).toFixed(2)}
                    </Text>
                    <SolanaIcon />
                  </Stack>
                  <Stack direction="horizontal" align="center" space="5">
                    <Input 
                      onChange={(val) => handleUserInput(val)} 
                      width="40" 
                      label="new bid" 
                      hideLabel 
                    />
                    <Button onClick={() => handleExecuteBid('increase_bid', userInput)}>
                      Increase Bid
                    </Button>
                  </Stack>
                  <Button onClick={() => handleExecuteBid('revoke_bid')} width="full" variant="secondary">
                    Cancel current bid
            </Button>
                </Stack>
              ) : (
                <Stack>
                  <Stack direction="horizontal" space="2">
                    <Text>
                      Min bid: {(highestBiddingValue * 1.1).toFixed(2)}
                    </Text>
                    <SolanaIcon />
                  </Stack>
                  <Stack direction="horizontal" wrap>
                    <Input
                      label="bid amount"
                      hideLabel
                      width={{ xs: 'full', sm: '44', md: '56' }}
                      onChange={(val) => handleUserInput(val)}
                    />
                    <Button
                      variant="primary"
                      width={{ xs: 'full', md: 'fit' }}
                      onClick={() => handleExecuteBid('place_bid', userInput)}
                    >
                      Place Bid
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
        <Box backgroundColor="background" padding="5" borderRadius="2xLarge">
        <LiquidationHeader headerData={headerData} />
        <Box>
          {fetchedPositions &&
            fetchedPositions.map((loan, i) => {
              return (
                <LiquidationCard
                  index={i}
                  key={i}
                  loan={loan}
                  liquidationType={true}
                  handleExecuteBid={() => handleExecuteBid}
              />
              );
            })}
        </Box>
        </Box>
      </Stack>
    </Layout>
  );
};

export default LiquidationPool;
