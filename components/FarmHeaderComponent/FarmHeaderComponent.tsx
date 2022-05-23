import { Box, Button, IconRefresh, Stack, Text } from 'degen';
import React, { useMemo, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import useGemFarm from 'hooks/useGemFarm';

interface FarmHeaderComponentProps {
  farmerState: string;
  stakedNFTsInFarm: { [tokenId: string]: NFT; };
  farmerVaultLocked: boolean;
  lockVault: () => Promise<void>;
}

const FarmHeaderComponent = (props: FarmHeaderComponentProps) => {
  const { farmerState,stakedNFTsInFarm, farmerVaultLocked, lockVault } = props;
  const {
    farmerAcc,
    farmAcc,
    collectionTotalNumber,
    rewardTokenName,
    handleRefreshRewardsButtonClick,
    claimRewards,
    availableToClaimA
  } = useGemFarm();

  const [txLoading, setTxLoading] = useState({
    value: false,
    txName: ''
  });

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

  const withTxLoading = async (tx: Function, txName: string) => {
    try {
      setTxLoading({ value: true, txName });
      await tx();
      setTxLoading({ value: false, txName: '' });
    } catch (error) {
      console.log(error);
      setTxLoading({ value: false, txName: '' });
    }
  };

  return (
    <Box
      backgroundColor="background"
      width="full"
      paddingX="8"
      paddingY="4"
      borderRadius="2xLarge"
      flex={1}
    >
      <Stack
        space="12"
        align={{ md: 'center', sm: 'stretch', xs: 'stretch' }}
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
          <Stack direction="vertical" space="1" align="center">
            <Text size="small" align="center" variant="label">
              Your vault
            </Text>
            <Text size="small" variant="small">
              {farmerState}
            </Text>
          </Stack>
          <Stack direction="vertical" space="1" align="center">
            <Text align="center" variant="label">
              Balance
            </Text>
            <Text variant="small">
              {`${availableToClaimA ?? 0} $${rewardTokenName}`}
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
        </Stack>
        <Stack space="3" justify="center" direction="horizontal">
          <Button
            onClick={handleRefreshRewardsButtonClick}
            variant="secondary"
            shape="square"
            size="small"
          >
            <IconRefresh />
          </Button>

          <Button
            onClick={() => withTxLoading(claimRewards, 'claim')}
            loading={txLoading.value && txLoading.txName === 'claim'}
            size="small"
          >
            {`Claim $${rewardTokenName}`}
          </Button>
          {(Object.values(stakedNFTsInFarm).length > 0 &&
            !farmerVaultLocked) && (
            <Button
              onClick={() => withTxLoading(lockVault, 'stake')}
              loading={txLoading.value && txLoading.txName === 'stake'}
              size="small"
              tone="green"
              variant="primary"
            >
              {`Stake Vault`}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FarmHeaderComponent;
