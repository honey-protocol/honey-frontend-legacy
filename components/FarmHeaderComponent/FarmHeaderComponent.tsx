import {
  Box,
  Button,
  IconRefresh,
  Stack,
  Text,
} from 'degen';
import React, { useMemo } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as styles from './FarmHeaderComponent.css';
import useGemFarm from 'hooks/useGemFarm';

const FarmHeaderComponent = () => {
  const {
    farmerAcc,
    farmAcc,
    availableToClaimA,
    availableToClaimB,
    collectionTotalNumber,
    rewardTokenName,
    claimRewards,
    handleRefreshRewardsButtonClick
  } = useGemFarm();

  const unstakingFee = useMemo(() => {
    if (!farmAcc) {
      return 0;
    }
    return farmAcc?.config.unstakingFeeLamp.toNumber();
  }, [farmAcc]);

  const stakedNftCount = useMemo(() => {
    if (!farmAcc) {
      return 0;
    }
    return farmAcc?.gemsStaked.toNumber();
  }, [farmAcc]);

  const farmerCount = useMemo(() => {
    if (!farmAcc) {
      return 0;
    }
    return farmAcc?.farmerCount.toNumber();
  }, [farmAcc]);

  const percentageStaked = useMemo(() => {
    if (!farmAcc) {
      return 0;
    }
    const totalNfts = Number(collectionTotalNumber);
    return ((stakedNftCount / totalNfts) * 100).toFixed(2);
  }, [farmAcc, stakedNftCount,collectionTotalNumber]);

  const claimA = useMemo(() => {
    if (!farmerAcc) {
      return 0;
    }
    return availableToClaimA;
  }, [farmerAcc, availableToClaimA]);

  // const claimB = useMemo(() => {
  //   if (!farmerAcc) {
  //     return 0;
  //   }
  //   return availableToClaimB?.toString();
  // }, [farmerAcc, availableToClaimB]);

  return (
    <Box className={styles.headerWrapper}>
      <Box>
        <Text variant="label">Total staked</Text>
        <Text variant="small">{stakedNftCount}</Text>
      </Box>
      <Box>
        <Text variant="label">% Staked</Text>
        <Text variant="small">{percentageStaked} %</Text>
      </Box>
      <Box>
        <Text variant="label">Farmer Count</Text>
        <Text variant="small">{farmerCount}</Text>
      </Box>
      {unstakingFee ? (
        <>
               <Box>
            <Text variant="label">Unstaking fee</Text>
            <Text variant="small">
              {(unstakingFee / LAMPORTS_PER_SOL).toFixed(2) + ' SOL'}
            </Text>
          </Box>
        </>
      ) : (
        <>
        </>
      )}
      <Stack space="3" direction="horizontal">
        <Box>
          <Button
            onClick={handleRefreshRewardsButtonClick}
            variant="secondary"
            shape="square"
            size="small"
          >
            <IconRefresh />
          </Button>
        </Box>

        <Button onClick={claimRewards} size="small">
          {`Claim ${(claimA / 1000000).toFixed(2)} $${rewardTokenName}`}
        </Button>
      </Stack>
    </Box>
  );
};

export default FarmHeaderComponent;
