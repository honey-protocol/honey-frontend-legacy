import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Input, Stack, Text, Tag } from 'degen';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import * as styles from './HoneyModal.css';
import { useStake } from 'hooks/useStake';
import { HONEY_DECIMALS } from 'helpers/sdk/constant';
import { convertToBN } from 'helpers/utils';
import { useGovernance } from 'contexts/GovernanceProvider';
import config from "../../config"

const HoneyModal = () => {
  const [amount, setAmount] = useState<number>(0);
  const [vestingPeriod, setVestingPeriod] = useState<number>(12);

  const {
    veHoneyAmount,
    lockedAmount,
    lockedPeriodEnd,
    honeyAmount,
    lockPeriodHasEnded
  } = useGovernance();

  const handleOnChange = (event: any) => {
    setAmount(event.target.value);
  };

  const vestingPeriodInSeconds = useMemo(() => {
    if ([1, 3, 6, 12, 48].includes(vestingPeriod)) {
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

  const { lock, unlock, escrow } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);

  const handleLock = useCallback(async () => {
    if (!amount || !vestingPeriodInSeconds) return;

    await lock(
      convertToBN(amount, HONEY_DECIMALS),
      new anchor.BN(vestingPeriodInSeconds),
      !!escrow
    );
  }, [lock, escrow, amount, vestingPeriodInSeconds]);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Lock HONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit HONEY and receive veHONEY
          </Text>
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
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                  <option value="48">4 years</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            type="number"
            label="Amount"
            labelSecondary={<Tag>{honeyAmount} pHONEY max</Tag>}
            max={honeyAmount || ''}
            min={0}
            value={amount || ''}
            disabled={!honeyAmount}
            hideLabel
            units="HONEY"
            placeholder="0"
            onChange={handleOnChange}
          />

          <Button
            onClick={handleLock}
            disabled={amount ? false : true}
            width="full"
          >
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button onClick={unlock} disabled={true} width="full">
            Unlock
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HoneyModal;
