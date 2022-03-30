import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Input, Stack, Text } from 'degen';
import { PublicKey } from '@solana/web3.js';
import * as styles from './VeHoneyModal.css';
import { useStake } from 'hooks/useStake';
import { useAccounts } from 'hooks/useAccounts';
import { PHONEY_DECIMALS, PHONEY_MINT } from 'helpers/sdk/constant';
import { convert, convertToBN } from 'helpers/utils';

const VeHoneyModal = () => {
  const [amount, setAmount] = useState<number>(1);
  const [vestingPeriod, setVestingPeriod] = useState<number>(7689600);

  const veHoneyRewardRate =
    vestingPeriod === 7689600
      ? 2
      : vestingPeriod === 15811200
      ? 5
      : vestingPeriod === 31622400
      ? 10
      : 1;
  const { tokenAccounts } = useAccounts();

  // ======================== Should replace with configuration ================
  const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
  const STAKE_POOL_ADDRESS = new PublicKey(
    process.env.NEXT_STAKE_POOL_ADDR ||
      'Cv9Hx3VRvqkz5JRPiZM8A2BH31yvpcT4qiUJLdtgu7TE'
  );
  // ============================================================================

  const { user, createUser, stake } = useStake(STAKE_POOL_ADDRESS);

  const depositedAmount = useMemo(() => {
    if (!user) {
      return 0;
    }

    return convert(user.depositAmount, PHONEY_DECIMALS);
  }, [user]);

  const pHoneyAmount = useMemo(() => {
    if (!pHoneyToken) {
      return 0;
    }

    return convert(pHoneyToken.info.amount, PHONEY_DECIMALS);
  }, [pHoneyToken]);

  const handleStake = useCallback(async () => {
    if (!amount) return;

    if (!user) {
      await createUser();
    }
    // todo: change for stake function (not inplemnted)
    await stake(convertToBN(amount, PHONEY_DECIMALS), convertToBN(vestingPeriod));
  }, [createUser, stake, user, amount, vestingPeriod]);

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
                {amount } pHONEY = {amount  * veHoneyRewardRate}{' '}
                HONEY
              </Text>
            </Box>
          </Stack>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHoney deposited
              </Text>
              <Text variant="small">{depositedAmount}</Text>
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
                  <option value="7689600">3 months</option>
                  <option value="15811200">6 months</option>
                  <option value="31622400">12 months</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            value={amount}
            type="number"
            label="Amount"
            hideLabel
            units="pHONEY"
            // placeholder="0"
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
