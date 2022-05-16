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
import { useMarket, useBorrowPositions } from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';

// TODO: should be fetched by SDK
const assetData: Array<AssetRowType> = [
  {
    vaultName: 'Cofre',
    vaultImageUrl: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    totalBorrowed: 14000,
    interest: 4.2,
    available: 11000,
    positions: 0
  }
];

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  const sdkConfig = ConfigureSDK();
  /**
     * @description calls upon the honey sdk - market 
     * @params solanas useConnection func. && useConnectedWallet func. && JET ID
     * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
    */
  const { honeyClient } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  useEffect(() => {

  }, [honeyClient]);


  const [currentOpenPositions, setCurrentOpenPositions] = useState(0);
  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params
   * @returns
  */  
     let { loading, collateralNFTPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)
       
     useEffect(() => {
       console.log('-------this is collateralpositions', collateralNFTPositions?.length)
       if (collateralNFTPositions) setCurrentOpenPositions(collateralNFTPositions.length);
     }, [collateralNFTPositions]);

  /**
     * @description **dont call - actually creates a market
     * @params **dont call - actually creates a market
     * @returns **dont call - actually creates a market
    */
  function createMarket() {
    if (honeyClient && wallet?.publicKey) {
      honeyClient.createMarket({
        owner: wallet.publicKey,
        quoteCurrencyMint: new PublicKey('So11111111111111111111111111111111111111112'),
        quoteCurrencyName: 'wSOL',
        nftCollectionCreator: new PublicKey('F69tu2rGcBrTtUT2ZsevujKRP4efVs9VfZPK2hYbYhvi'),
        nftOraclePrice: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ'),
        nftOracleProduct: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ')
      });
    }
  }
  
  // createMarket();

  /**
   * @description logic for rendering borrow or lend page 
   * @params 0 | 1
   * @returns state for rendering correct modal
  */
  const [borrowOrLend, setBorrowOrLend] = useState(0);
  const loadBorrowPage = wallet && borrowOrLend === 0;
  const loadLendPage = wallet && borrowOrLend === 1;
  
  /**
   * @description logic for rendering out create market page
   * @params 0 | 1
   * @returns create market modal or Pool modal in return of Loan component
  */
  const [renderCreateMarket, setRenderCreateMarket] = useState(0);
  
  useEffect(() => {
  }, [renderCreateMarket]);
  
  function handleCreateMarket() {
    setRenderCreateMarket(1);
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
                    onClick: () => setBorrowOrLend(0)
                  },
                  { title: 'Lend', onClick: () => setBorrowOrLend(1) }
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
                <Text>Your positions</Text>
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
                              openPositions={currentOpenPositions}
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
                              openPositions={currentOpenPositions}
                            />
                          </a>
                        </Link>
                      )}
                      {!wallet && (
                        <Box onClick={connect} cursor="pointer">
                          <AssetRow 
                            data={item} 
                            openPositions={currentOpenPositions}
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
