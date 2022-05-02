import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack, IconSearch, Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import DepositWithdrawModule from '../../components/DepositWithdrawModule/DepositWIthdrawModule';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import LoanHeaderComponent from 'components/LoanHeaderComponent/LoanHeaderComponent';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  deposit,
  HoneyUser,
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  usePools,
  useHoney,
  withdraw,
  borrow,
  repay,
} from '@honey-finance/sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const assetData: Array<AssetRowType> = [
  {
    vaultName: 'Cofre',
    vaultImageUrl: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    totalBorrowed: 14000,
    interest: 4,
    available: 11000,
    // make dynamic based off open positions
    positions: 0
  }
];

const Loan: NextPage = () => {
  /**
   * @description calls upon sdk config object
   * @params none
   * @returns connection | wallet | honeyID | marketID
  */
  const sdkConfig = ConfigureSDK();
  
  /**
   * @description calls upon the honey sdk 
   * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
   * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
  */
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  const { market, marketReserveInfo, parsedReserves }  = useHoney();

  useEffect(() => {
    console.log('the honeyUser and reserves', honeyUser, honeyReserves)
  }, [honeyUser, honeyReserves]);
  


  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [borrowOrLend, setBorrowOrLend] = useState(0);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const loadBorrowPage = wallet && borrowOrLend === 0;
  const loadLendPage = wallet && borrowOrLend === 1;

  function showLoanModal() {
    setModalIsVisible(true);
  }

  return (
    <Layout>
      <Stack>
        <ModalContainer
          onClose={() => setModalIsVisible(false)}
          isVisible={modalIsVisible}
        >
          <DepositWithdrawModule />
        </ModalContainer>
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
              <LoanHeaderComponent />
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
                          <AssetRow data={item} />
                        </a>
                      </Link>
                    )}
                    {loadLendPage && (
                      <Link
                        href="/loan/lend/[name]"
                        as={`/loan/lend/${item.vaultName}`}
                      >
                        <a>
                          <AssetRow data={item} />
                        </a>
                      </Link>
                    )}
                    {!wallet && (
                      <Box onClick={connect} cursor="pointer">
                        <AssetRow data={item} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Loan;
