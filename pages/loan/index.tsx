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

// TODO: should be fetched by SDK
const assetData: Array<AssetRowType> = [
  {
    vaultName: 'Cofre',
    vaultImageUrl: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    totalBorrowed: 14000,
    interest: 4,
    available: 11000,
    positions: 0
  }
];

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  /**
   * @description logic for rendering borrow or lend page 
   * @params 0 | 1
   * @returns state for rendering correct modal
  */
  const [borrowOrLend, setBorrowOrLend] = useState(0);
  const loadBorrowPage = wallet && borrowOrLend === 0;
  const loadLendPage = wallet && borrowOrLend === 1;

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
