import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Text, Stack, Button, IconSearch, Input } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/farm.css';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useState, useEffect } from 'react';
import { newFarmCollections, TGFarm } from '../../constants/new-farms';
import getCollectionExpireDate from '../../helpers/gemFarm';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import FarmCollectionCard from 'components/FarmCollectionCard/FarmCollectionCard';

/**
 * @params collection and i
 * @description filters collection based off expire date
 * @returns array of live farms
 **/
const liveFarms = newFarmCollections.filter(
  (collection, i) =>
    getCollectionExpireDate(
      collection.eventStartDate,
      collection.eventDuration
    ) > new Date()
);

/**
 * @params collection and i
 * @description filters based off completion date
 * @returns an array of completed farms
 **/
const completedFarms = newFarmCollections.filter(
  (collection, i) =>
    getCollectionExpireDate(
      collection.eventStartDate,
      collection.eventDuration
    ) < new Date()
);

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const Farm: NextPage = (props: any) => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [liveOrCompleted, setLiveOrCompleted] = useState(0);
  const [showCompletedFarms, setShowCompletedFarms] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [displayedCollections, setDisplayedCollections] = useState(liveFarms);

  /**
   * @params event object
   * @description filters collections based off user input; completed or live
   * @returns sets the farms in the UI
   **/
  const onSearchInputChange = (event: any) => {
    const { value } = event.target;
    // @Daan - we call the setSearchInput- we pass a value but we don't do anything with the value?
    setSearchInput(value);
    const collection = showCompletedFarms ? completedFarms : liveFarms;
    const searchResult = collection.filter(collection =>
      collection.name.toLowerCase().includes(value.toLowerCase())
    );
  };

  /**
   * @relatesTo onSearchInputChange function
   * @params None
   * @description sets the UI to live or completed farms
   * @returns sets the farms in the UI
   **/
  useEffect(() => {
    setSearchInput('');
    if (!showCompletedFarms) {
      setDisplayedCollections(liveFarms);
    } else {
      setDisplayedCollections(completedFarms);
    }
  }, [showCompletedFarms]);

  return (
    <Layout>
      <Box>
        <Box minWidth="full" gap="3" paddingTop="4">
          <Stack direction="horizontal" wrap justify="center" align="center">
            <Stack
              direction="horizontal"
              justify="space-between"
              wrap
              align="center"
            >
              <Box paddingRight="3">
                <Text align="left" variant="extraLarge" weight="bold">
                  Staking v3 Alpha
                </Text>
              </Box>
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
            </Stack>
            <Box className={styles.searchContainer}>
              <Input
                label=""
                placeholder="Search by name"
                prefix={<IconSearch />}
              />
            </Box>
          </Stack>
        </Box>
        <Box minWidth="full" gap="6" paddingTop="8">
          <Stack>
            <Box className={styles.collectionCardsContainer}>
              {/* {[0, 1, 2, 3, 4].map((num, i) => ( */}
              {newFarmCollections.map((item: TGFarm, i: number) => (
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
      </Box>
    </Layout>
  );
};

export default Farm;
