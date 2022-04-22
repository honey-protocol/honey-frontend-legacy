import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Text, Stack, Button, IconSearch, Input, Spinner } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/farm.css';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useState, useEffect, useCallback } from 'react';
import { newFarmCollections, TGFarm } from '../../constants/new-farms';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import FarmCollectionCard from 'components/FarmCollectionCard/FarmCollectionCard';
import getCollectionExpireDate from 'helpers/dateUtils';
import { getFarmsStakedIn } from 'helpers/gemFarm';

/**
 * @params collection and i
 * @description filters collection based off expire date
 * @returns array of live farms
 **/
const liveFarms = newFarmCollections.filter((collection, i) => {
  if (collection.eventDuration === '∞') return true;
  const expireDate = getCollectionExpireDate(
    new Date(collection.eventStartDate),
    Number(collection.eventDuration)
  );
  return expireDate > new Date();
});

/**
 * @params collection and i
 * @description filters based off completion date
 * @returns an array of completed farms
 **/
const completedFarms = newFarmCollections.filter((collection, i) => {
  const expireDate = getCollectionExpireDate(
    new Date(collection.eventStartDate),
    Number(collection.eventDuration)
  );
  return expireDate < new Date();
});

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const Farm: NextPage = (props: any) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const connection = useConnection();
  const [liveOrCompleted, setLiveOrCompleted] = useState(0);
  const [allOrStakedIn, setAllOrStakedIn] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [displayedCollections, setDisplayedCollections] = useState(liveFarms);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @params event object
   * @description filters collections based off user input; completed or live
   * @returns sets the farms in the UI
   **/
  const onSearchInputChange = (event: any) => {
    const { value } = event.target;
    setSearchInput(value);
    const collection = liveOrCompleted ? completedFarms : liveFarms;
    const searchResult = collection.filter(collection =>
      collection.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedCollections(searchResult);
  };

  /**
   * @relatesTo onSearchInputChange function
   * @params None
   * @description sets the UI to live or completed farms
   * @returns sets the farms in the UI
   **/
  const onFarmFilter = useCallback(async () => {
    setSearchInput('');
    if (!liveOrCompleted && !allOrStakedIn) {
      setDisplayedCollections(liveFarms);
    } else if (!liveOrCompleted && allOrStakedIn) {
      //
      setIsLoading(true);
      const stakedInFarms = await getFarmsStakedIn(
        liveFarms,
        connection,
        wallet
      );
      if (!stakedInFarms) {
        setDisplayedCollections([]);
      } else {
        setDisplayedCollections(stakedInFarms);
      }
      setIsLoading(false);
      //
    } else if (liveOrCompleted && allOrStakedIn) {
      //
      setIsLoading(true);
      const stakedInFarms = await getFarmsStakedIn(
        completedFarms,
        connection,
        wallet
      );
      if (!stakedInFarms) {
        setDisplayedCollections([]);
      } else {
        setDisplayedCollections(stakedInFarms);
      }
      setIsLoading(false);
      //
    } else {
      setDisplayedCollections(completedFarms);
    }
  }, [allOrStakedIn, liveOrCompleted, connection, wallet]);

  useEffect(() => {
    if (!wallet) return;
    onFarmFilter();
  }, [onFarmFilter, wallet]);

  return (
    <Layout>
      <Box display={'flex'} flexDirection="column" flex={1}>
        <Box minWidth="full" gap="3" paddingTop="4">
          <Stack
            direction="horizontal"
            wrap
            justify="space-between"
            align="center"
          >
            {/* <Stack
              direction="horizontal"
              justify="space-between"
              wrap
              align="center"
            > */}
            {/* <Box paddingRight="3">
                <Text align="left" variant="extraLarge" weight="bold">
                  Staking v3 Alpha
                </Text>
              </Box> */}
            <ToggleSwitch
              buttons={[
                {
                  title: 'Live',
                  onClick: () => setLiveOrCompleted(0)
                },
                { title: 'Completed', onClick: () => setLiveOrCompleted(1) }
              ]}
              activeIndex={liveOrCompleted}
            />
            <Stack align="center" direction={'horizontal'}>
              <ToggleSwitch
                buttons={[
                  {
                    title: 'All',
                    onClick: () => setAllOrStakedIn(0)
                  },
                  { title: 'Staked In', onClick: () => setAllOrStakedIn(1) }
                ]}
                activeIndex={allOrStakedIn}
              />
              <Box className={styles.searchContainer}>
                <Input
                  label=""
                  value={searchInput}
                  onChange={onSearchInputChange}
                  placeholder="Search by name"
                  prefix={<IconSearch />}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
        {isLoading ? (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size="large" />
          </Box>
        ) : (
          <Box minWidth="full" gap="6" paddingTop="8">
            <Stack flex={1}>
              <Box className={styles.collectionCardsContainer}>
                {displayedCollections.map((item: TGFarm, i: number) => (
                  <Box key={item.id}>
                    {wallet ? (
                      <Link href="/farm/[name]" as={`/farm/${item.name}`}>
                        <a>
                          <FarmCollectionCard data={item} key={item.id} />
                        </a>
                      </Link>
                    ) : (
                      <Box onClick={connect} cursor="pointer">
                        <FarmCollectionCard data={item} key={item.id} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Farm;
