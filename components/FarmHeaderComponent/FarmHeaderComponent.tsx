import { Box, Button, IconRefresh, Stack, Text } from 'degen';
import React, { useMemo } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
// import * as styles from './FarmHeaderComponent.css';
import useGemFarm from 'hooks/useGemFarm';

const FarmHeaderComponent = () => {
  const {
    farmerAcc,
    farmAcc,
    // availableToClaimA,
    // availableToClaimB,
    collectionTotalNumber,
    rewardTokenName,
    claimRewards,
    handleRefreshRewardsButtonClick
  } = useGemFarm();

  // const cooldownSecs = useMemo(() => {
  //   if (!farmAcc) {
  //     return 0;
  //   }
  //   return farmAcc?.config.cooldownPeriodSec;
  // }, [farmAcc]);

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
  }, [farmAcc, stakedNftCount, collectionTotalNumber]);

  // const claimA = useMemo(() => {
  //   if (!farmerAcc) {
  //     return 0;
  //   }
  //   return availableToClaimA;
  // }, [farmerAcc, availableToClaimA]);

  // const claimB = useMemo(() => {
  //   if (!farmerAcc) {
  //     return 0;
  //   }
  //   return availableToClaimB?.toString();
  // }, [farmerAcc, availableToClaimB]);

  return (
    <Box
      backgroundColor="background"
      width="full"
      paddingX="5"
      paddingY="3"
      borderRadius="2xLarge"
      flex={1}
    >
      <Stack
        space="12"
        align="center"
        justify="space-between"
        flex={1}
        direction={{ md: 'horizontal', sm: 'vertical', xs: 'vertical' }}
      >
        <Stack
          wrap={{ md: false, sm: true }}
          direction="horizontal"
          justify="space-between"
          space="4"
          flex={1}
        >
          <Stack direction="vertical" space="1" align="center">
            <Text align="center" size="small" variant="label">
              Total staked
            </Text>
            <Text size="small" variant="small">
              {stakedNftCount}
            </Text>
          </Stack>
          <Stack direction="vertical" space="1" align="center">
            <Text size="small" align="center" variant="label">
              % Staked
            </Text>
            <Text size="small" variant="small">
              {percentageStaked} %
            </Text>
          </Stack>
          <Stack direction="vertical" space="1" align="center">
            <Text size="small" align="center" variant="label">
              Farmers
            </Text>
            <Text size="small" variant="small">
              {farmerCount}
            </Text>
          </Stack>
          {Boolean(unstakingFee) && (
            <Stack direction="vertical" space="1" align="center">
              <Text align="center" variant="label">
                Unstaking fee
              </Text>
              <Text variant="small">
                {(unstakingFee / LAMPORTS_PER_SOL).toFixed(2) + ' SOL'}
              </Text>
            </Stack>
          )}
          {/* {Boolean(cooldownSecs) && (
            <Stack direction="vertical" space="1" align="center">
              <Text align="center" variant="label">
                Cooldown
              </Text>
              <Text variant="small">Yes</Text>
            </Stack>
          )} */}
        </Stack>
        <Stack space="3" direction="horizontal">
          <Button
            onClick={handleRefreshRewardsButtonClick}
            variant="secondary"
            shape="square"
            size="small"
          >
            <IconRefresh />
          </Button>

          <Button onClick={claimRewards} size="small">
            {`Claim $${rewardTokenName}`}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FarmHeaderComponent;
