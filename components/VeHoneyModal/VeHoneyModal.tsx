import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Input, Stack, Text, Tag } from 'degen';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import * as styles from './VeHoneyModal.css';
import { useStake } from 'hooks/useStake';
import { PHONEY_DECIMALS } from 'helpers/sdk/constant';
import { convertToBN } from 'helpers/utils';
import { useGovernance } from 'contexts/GovernanceProvider';
import config from '../../config'

const VeHoneyModal = () => {
  const [amount, setAmount] = useState<number>(0);
  const [vestingPeriod, setVestingPeriod] = useState<number>(12);
  const [pHoneyConversionAmount, setPHoneyConversionAmount] =
    useState<number>(0);

  const {
    veHoneyAmount,
    lockedAmount,
    lockedPeriodEnd,
    pHoneyAmount,
    lockPeriodHasEnded
  } = useGovernance();

  const handleOnChange = (event: any) => {
    setAmount(event.target.value);
  };

  const veHoneyRewardRate = useMemo(() => {
    return vestingPeriod === 3
      ? 2
      : vestingPeriod === 6
      ? 5
      : vestingPeriod === 12
      ? 10
      : 0;
  }, [vestingPeriod]);

  const vestingPeriodInSeconds = useMemo(() => {
    if ([3, 6, 12].includes(vestingPeriod)) {
      const date = new Date();
      const current = Math.floor(date.getTime() / 1000);
      date.setMonth(date.getMonth() + vestingPeriod);
      const nMonthsLater = Math.floor(date.getTime() / 1000);

      return nMonthsLater - current;
    }
    return 0;
  }, [vestingPeriod]);

  const STAKE_POOL_ADDRESS = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
  const LOCKER_ADDRESS = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);

  const { stake, unlock, escrow } = useStake(
    STAKE_POOL_ADDRESS,
    LOCKER_ADDRESS
  );

  const handleStake = useCallback(async () => {
    if (!amount || !vestingPeriodInSeconds) return;

    await stake(
      convertToBN(amount, PHONEY_DECIMALS),
      new anchor.BN(vestingPeriodInSeconds),
      !!escrow
    );
  }, [stake, escrow, amount, vestingPeriodInSeconds]);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get veHONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and receive veHONEY
          </Text>
          <Stack space="2">
            <Text align="center" size="small">
              After vesting, you get:
            </Text>
            <Box
              marginX="auto"
              borderColor="accent"
              borderWidth="0.375"
              minHeight="7"
              borderRadius="large"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="3/4"
            >
              <Text variant="small" color="accent">
                {amount} pHONEY = {Number(amount) * veHoneyRewardRate} HONEY
              </Text>
            </Box>
          </Stack>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                $HONEY (locked)
              </Text>
              <Text variant="small">{lockedAmount}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                veHoney (locked)
              </Text>
              <Text variant="small">{veHoneyAmount}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Lock period ends
              </Text>
              <Text variant="small">{lockedPeriodEnd}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Vesting period
              </Text>
              <Box>
                <select
                  name="vestingPeriod"
                  value={vestingPeriod}
                  className={styles.select}
                  onChange={event =>
                    setVestingPeriod(Number(event.target.value))
                  }
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            type="number"
            label="Amount"
            labelSecondary={<Tag>{pHoneyAmount} pHONEY max</Tag>}
            max={pHoneyAmount || ''}
            min={0}
            value={amount || ''}
            disabled={!pHoneyAmount}
            hideLabel
            units="pHONEY"
            placeholder="0"
            onChange={handleOnChange}
          />

          <Button
            onClick={handleStake}
            disabled={amount ? false : true}
            width="full"
          >
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button onClick={unlock} disabled={lockPeriodHasEnded} width="full">
            Unlock
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default VeHoneyModal;
