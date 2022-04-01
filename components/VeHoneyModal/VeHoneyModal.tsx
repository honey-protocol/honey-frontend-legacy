import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Input, Stack, Text } from 'degen';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

import * as styles from './VeHoneyModal.css';
import { useStake } from 'hooks/useStake';
import { useAccounts } from 'hooks/useAccounts';
import {
  HONEY_DECIMALS,
  PHONEY_DECIMALS,
  PHONEY_MINT
} from 'helpers/sdk/constant';
import { convert, convertToBN } from 'helpers/utils';

const VeHoneyModal = () => {
  const [amount, setAmount] = useState<number>(1);
  const [vestingPeriod, setVestingPeriod] = useState<number>(3);
  const [pHoneyConversionAmount, setPHoneyConversionAmount] =
    useState<number>(0);

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

  const { tokenAccounts } = useAccounts();

  // ======================== Should replace with configuration ================
  const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
  const STAKE_POOL_ADDRESS = new PublicKey(
    process.env.NEXT_STAKE_POOL_ADDR ||
      '4v62DWSwrUVEHe2g88MeyJ7g32vVzQsCnADZF8yUy8iU'
  );
  const LOCKER_ADDRESS = new PublicKey(
    process.env.NEXT_LOCKER_ADDR ||
      '5FnK8H9kDbmPNpBYMuvSkDevkMfnVPRrPNNqmTQyBBae'
  );
  // ============================================================================

  const { stake, escrow } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);

  const lockedAmount = useMemo(() => {
    if (!escrow) {
      return 0;
    }

    return convert(escrow.amount, HONEY_DECIMALS);
  }, [escrow]);

  const pHoneyAmount = useMemo(() => {
    if (!pHoneyToken) {
      return 0;
    }

    return convert(pHoneyToken.info.amount, PHONEY_DECIMALS);
  }, [pHoneyToken]);

  const handleStake = useCallback(async () => {
    if (!amount || !vestingPeriodInSeconds) return;

    // console.log(vestingPeriodInSeconds);

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
            Deposit pHONEY and recieve veHONey
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
                {amount} pHONEY = {amount * veHoneyRewardRate} HONEY
              </Text>
            </Box>
          </Stack>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your Honey locked
              </Text>
              <Text variant="small">{lockedAmount}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY balance
              </Text>
              <Text variant="small">{pHoneyAmount}</Text>
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
                  <option value="12">12 months</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            // value={amount}
            type="number"
            label="Amount"
            hideLabel
            units="pHONEY"
            placeholder="0"
            onChange={event => setAmount(Number(event.target.value))}
          />
          <Button
            onClick={handleStake}
            disabled={amount ? false : true}
            width="full"
          >
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default VeHoneyModal;
