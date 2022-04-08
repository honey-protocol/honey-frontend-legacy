import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Box, Button, Input, Stack, Text, Tag } from 'degen';
import { PublicKey } from '@solana/web3.js';
import { useStake } from 'hooks/useStake';
import { useAccounts } from 'hooks/useAccounts';
import { PHONEY_DECIMALS, PHONEY_MINT } from 'helpers/sdk/constant';
import { convert, convertToBN } from 'helpers/utils';

// console.log("The stake pool address is : ", process.env.PUBLIC_NEXT_STAKE_POOL_ADDRESS)
const PHoneyModal = () => {
  const [amount, setAmount] = useState<number>(0);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);

  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it

    setAmount(Number(event.target.value));
  };

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

  const { user, deposit, claim, claimableAmount } = useStake(
    STAKE_POOL_ADDRESS,
    LOCKER_ADDRESS
  );

  useEffect(() => {
    setIsClaimable(claimableAmount !== 0);
  }, [claimableAmount]);

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

  const handleDeposit = useCallback(async () => {
    if (!amount) return;

    // if (!user) {
    //   await createUser();
    // }

    await deposit(convertToBN(amount, PHONEY_DECIMALS), !!user);
  }, [deposit, user, amount]);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get HONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and receive HONEY
          </Text>
          <Box
            marginX="auto"
            borderColor="accent"
            borderWidth="0.375"
            height="7"
            borderRadius="large"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3/4"
          >
            <Text variant="small" color="accent">
              1 pHONEY = 1 HONEY
            </Text>
          </Box>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY deposited
              </Text>
              <Text variant="small">{depositedAmount}</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Claimable Amount
              </Text>
              <Text variant="small">{claimableAmount}</Text>
            </Stack>
          </Stack>
          <Input
            type="number"
            label="Amount"
            labelSecondary={<Tag>{pHoneyAmount} pHONEY max</Tag>}
            disabled={!pHoneyAmount}
            max={pHoneyAmount || ''}
            min={0}
            hideLabel
            value={amount || ''}
            units="pHONEY"
            placeholder="0"
            onChange={handleOnChange}
          />
          <Button onClick={handleDeposit} disabled={!amount} width="full">
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button onClick={claim} disabled={claimableAmount == 0} width="full">
            Claim
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PHoneyModal;
