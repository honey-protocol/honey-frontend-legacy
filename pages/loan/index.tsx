import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack, IconSearch, Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import LoanHeaderComponent from 'components/LoanHeaderComponent/LoanHeaderComponent';
import CreateMarket from 'pages/createmarket';
import  { ConfigureSDK } from '../../helpers/loanHelpers';
import { useMarket, useBorrowPositions, useHoney, useAnchor, ObligationAccount} from '@honey-finance/sdk';
import {TYPE_ZERO, TYPE_ONE} from '../../constants/loan';
import BN from 'bn.js';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {RoundHalfDown} from '../../helpers/utils';

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const sdkConfig = ConfigureSDK();
  const {program} = useAnchor();

  /**
    * @description calls upon markets which
    * @params none
    * @returns market | market reserve information | parsed reserves |
  */
  const { market, marketReserveInfo, parsedReserves }  = useHoney();
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  /**
   *
  */
  const [totalMarkDeposits, setTotalMarketDeposits] = useState(0);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [totalMarketPositions, setTotalMarketPositions] = useState(0);
  const [totAll, setTotalAll] = useState(0);

  // TODO: should be fetched by SDK
  const assetData: Array<AssetRowType> = [
    {
      vaultName: 'Cofre',
      vaultImageUrl: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
      totalBorrowed: RoundHalfDown(totalMarketDebt),
      interest: 10,
      available: totalMarkDeposits,
      positions: totalMarketPositions
    }
  ];

  useEffect(() => {
      async function fetchObligations() {
        console.log('fetching obligations...');
        let obligations = await program?.account?.obligation?.all();
        if (obligations) {
          setTotalMarketPositions(obligations.length);

          console.log('obligations', obligations);

          obligations.map(item => {
            let owner = item.account.owner.toString();
            console.log('owner', owner);
            let nftMints:PublicKey[] = item.account.collateralNftMint;
            nftMints.map((nft) => {
              if(nft.toString() != '11111111111111111111111111111111') {
                console.log('nftCollateral', nft.toString());
              }
            })
          })
        }
      }

      fetchObligations();
  }, [program]);

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
  */
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
    }
  }, [parsedReserves]);

  useEffect(() => {
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');

    if (honeyReserves) {
      const depositReserve = honeyReserves.filter((reserve) =>
        reserve?.data?.tokenMint?.equals(depositTokenMint),
      )[0];

      const reserveState = depositReserve.data?.reserveState;
      let marketDebt = reserveState?.outstandingDebt.div(new BN(10 ** 15)).toNumber();
      if (marketDebt) {
        let sum = Number((marketDebt / LAMPORTS_PER_SOL))

        setTotalMarketDebt(sum);
      }
    }

  }, [honeyReserves]);

  /**
   * @description state to update open positions
   * @params none
   * @returns currentOpenPositions
  */
  const [currentOpenPositions, setCurrentOpenPositions] = useState(TYPE_ZERO);

  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params none
   * @returns collateralNFTPositions | loading | error
  */
  let { loading, collateralNFTPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)
  /**
   * @description sets open positions
   * @params none
   * @returns collateralNFTPositions
  */
  useEffect(() => {
    if (collateralNFTPositions) setCurrentOpenPositions(collateralNFTPositions.length);
  }, [collateralNFTPositions]);

  /**
     * @description **dont call - actually creates a market
     * @params **dont call - actually creates a market
     * @returns **dont call - actually creates a market
    */
  function createMarket() {
    // if (honeyClient && wallet?.publicKey) {
    //   honeyClient.createMarket({
    //     owner: wallet.publicKey,
    //     quoteCurrencyMint: new PublicKey('So11111111111111111111111111111111111111112'),
    //     quoteCurrencyName: 'wSOL',
    //     nftCollectionCreator: new PublicKey('F69tu2rGcBrTtUT2ZsevujKRP4efVs9VfZPK2hYbYhvi'),
    //     nftOraclePrice: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ'),
    //     nftOracleProduct: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ')
    //   });
    // }
    return;
  }

  /**
   * @description logic for rendering borrow or lend page
   * @params 0 | 1
   * @returns state for rendering correct modal
  */
  const [borrowOrLend, setBorrowOrLend] = useState(TYPE_ZERO);
  const loadBorrowPage = wallet && borrowOrLend === TYPE_ZERO;
  const loadLendPage = wallet && borrowOrLend === TYPE_ONE;

  /**
   * @description logic for rendering out create market page
   * @params 0 | 1
   * @returns create market modal or Pool modal in return of Loan component
  */
  const [renderCreateMarket, setRenderCreateMarket] = useState(TYPE_ZERO);

  useEffect(() => {
  }, [renderCreateMarket]);

  function handleCreateMarket() {
    setRenderCreateMarket(TYPE_ONE);
  }

  return (
    <Layout>
      <Stack>
        <Box marginY="4">
          <Stack direction="vertical" space="5">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <ToggleSwitch
                buttons={[
                  {
                    title: 'Borrow',
                    onClick: () => setBorrowOrLend(TYPE_ZERO)
                  },
                  { title: 'Lend', onClick: () => setBorrowOrLend(TYPE_ONE) }
                ]}
                activeIndex={borrowOrLend}
              />
              <LoanHeaderComponent
                handleCreateMarket={handleCreateMarket}
                openPositions={currentOpenPositions}
              />
            </Stack>
          </Stack>
        </Box>
        <Box
            backgroundColor="backgroundTertiary"
            minWidth="full"
            gap="3"
            borderRadius="2xLarge"
            padding="5"
            width="full"
          >
            <Stack>
        {
          renderCreateMarket == 1
          ?
            <CreateMarket
              setRenderCreateMarket={setRenderCreateMarket}
              createMarket={createMarket}
            />
          :

            <Stack>
              <Box className={styles.cardMenuContainer}>
                <Box padding="1">
                  <Input
                    label=""
                    placeholder="Search by name"
                    prefix={<IconSearch />}
                  />
                </Box>
                <Text>Total borrowed</Text>
                <Text>Interest</Text>
                <Text>Available</Text>
                <Text>Total positions</Text>
              </Box>
              <Box>
                <hr className={styles.lineDivider}></hr>
              </Box>
              <Stack>
                <Box>
                  {assetData.map(item => (
                    <Box key={item.vaultName}>
                      {loadBorrowPage && (
                        <Link href="/loan/[name]" as={`/loan/${item.vaultName}`}>
                          <a>
                            <AssetRow
                              data={item}
                            />
                          </a>
                        </Link>
                      )}
                      {loadLendPage && (
                        <Link
                          href="/loan/lend/[name]"
                          as={`/loan/lend/${item.vaultName}`}
                        >
                          <a>
                            <AssetRow
                              data={item}
                            />
                          </a>
                        </Link>
                      )}
                      {!wallet && (
                        <Box onClick={connect} cursor="pointer">
                          <AssetRow
                            data={item}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Stack>
          }
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Loan;
