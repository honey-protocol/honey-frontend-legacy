import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card } from 'degen';
import { Stack } from 'degen';
import { Button } from 'degen';
import { IconPlusSmall, IconSearch } from 'degen';
import { Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import { style } from '@vanilla-extract/css';

const assetData: Array<AssetRowType> = [
  {
    vaultName: 'TetranodeNfts',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 45876,
    interest: 45.9,
    available: 35345,
    positions: 3
  },
  {
    vaultName: 'Sol BAYCs',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 45876,
    interest: 45.9,
    available: 35345,
    positions: 3
  },
  {
    vaultName: 'Azuki',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 45876,
    interest: 45.9,
    available: 35345,
    positions: 3
  },
  {
    vaultName: 'Galactic Geckos',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 123123,
    interest: 45.9,
    available: 35345,
    positions: 3
  },
  {
    vaultName: 'Aurory',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 45876,
    interest: 45.9,
    available: 35345,
    positions: 3
  },
  {
    vaultName: 'SolPunks',
    vaultImageUrl:
      'https://pbs.twimg.com/profile_images/1498758008901234689/TCdlxoj7_400x400.jpg',
    totalBorrowed: 45876,
    interest: 45.9,
    available: 35345,
    positions: 3
  }
];

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [liveOrCompleted, setLiveOrCompleted] = useState(0);

  return (
    <Layout>
      <Stack>
        <Box height="16" minWidth="full" gap="3" paddingTop="3">
          <Stack direction="horizontal" justify="space-between" align="center">
            <Text align="left" variant="extraLarge" weight="bold">
              Lend your assets, Earn yield
            </Text>
            <Button
              prefix={<IconPlusSmall />}
              variant="transparent"
              size="small"
              onClick={() => {}}
            >
              New Vault
            </Button>
          </Stack>
        </Box>
        {/* <Box  height="16" minWidth="full" gap="3" paddingTop="3"> */}
        <Stack direction="horizontal" justify="space-between" align="center">
          <ToggleSwitch
              buttons={[
                {
                  title: 'Borrow',
                  onClick: () => setLiveOrCompleted(0)
                },
                { title: 'Loan', onClick: () => setLiveOrCompleted(1) }
              ]}
              activeIndex={liveOrCompleted}
            />
          <Box padding="1">
            <Input
              label=""
              placeholder="Search by name"
              prefix={<IconSearch />}
            />
          </Box>
        </Stack>
        <Box
          backgroundColor="backgroundTertiary"
          minWidth="full"
          gap="3"
          borderRadius="2xLarge"
          padding="5"
          width="full"
          // className={styles.cardContainer}
        >
          <Stack>
            <Box className={styles.cardMenuContainer}>
                <Text>Vault name</Text>
                <Text>Total borrowed</Text>
                <Text>Interest</Text>
                <Text>Available</Text>
                <Text>Your positions</Text>
            </Box>
            <Box>
              <hr className={styles.lineDivider}></hr>
            </Box>
            <Box>
              <Box>
                {assetData.map(item => (
                  <Box key={item.vaultName}>
                    {wallet ? (
                      <Link href="/loan/[name]" as={`/loan/${item.vaultName}`}>
                        <a>
                          <AssetRow data={item} />
                        </a>
                      </Link>
                      ) : (
                        <Box onClick={connect} cursor="pointer">
                          <AssetRow data={item} />
                        </Box>
                      )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Loan;
