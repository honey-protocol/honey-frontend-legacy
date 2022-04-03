import type { NextPage } from 'next';
import { Box, Button, Card, IconExclamation, Input, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useState, useMemo } from 'react';
import PHoneyModal from 'components/PHoneyModal/PHoneyModal';
import VeHoneyModal from 'components/VeHoneyModal/VeHoneyModal';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useStake } from 'hooks/useStake';
import { useAccounts } from 'hooks/useAccounts';
import {
  PHONEY_DECIMALS,
  PHONEY_MINT,
  HONEY_DECIMALS
} from 'helpers/sdk/constant';
import { convert, convertToBN } from 'helpers/utils';

const Governance: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [showPHoneyModal, setShowPHoneyModal] = useState(false);
  const [showVeHoneyModal, setShowVeHoneyModal] = useState(false);

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

  const { user, escrow } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);

  const lockedAmount = useMemo(() => {
    if (!escrow) {
      return 0;
    }

    return convert(escrow.amount, HONEY_DECIMALS);
  }, [escrow]);

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

  return (
    <Layout>
      <Stack space="5" flex={1}>
        {/* Modals */}
        <ModalContainer
          onClose={() => setShowPHoneyModal(false)}
          isVisible={showPHoneyModal}
        >
          <PHoneyModal />
        </ModalContainer>
        <ModalContainer
          onClose={() => setShowVeHoneyModal(false)}
          isVisible={showVeHoneyModal}
        >
          <VeHoneyModal />
        </ModalContainer>
        {/* Page title */}
        <Box marginTop="5">
          <Text variant="extraLarge" weight="bold">
            Vote on new collateral assets
          </Text>
        </Box>
        {/* Cards row */}
        <Stack
          direction={{
            lg: 'horizontal',
            md: 'horizontal',
            sm: 'vertical',
            xs: 'vertical'
          }}
          space="6"
        >
          <Card width={{ md: '1/2' }} level="2" padding="6">
            <Box display="flex" height="full">
              <Stack flex={1} justify="center" align="center" space="3">
                <IconExclamation color="accent" />
                <Text variant="small" align="center">
                  pre-IDO HONEY (pHONEY) has to be deposited after the IDO on
                  March 30th You can{' '}
                  <Text as="span" color="accent">
                    stake it for HONEY or lock it for veHONEY.
                  </Text>{' '}
                  Check out our docs to learn the difference between HONEY and
                  veHONEY
                </Text>
                <Stack direction="horizontal" justify="center" align="center">
                  <Button
                    as="a"
                    href="https://docs.honey.finance/products/tokens"
                    target="_blank"
                    size="small"
                    variant="tertiary"
                  >
                    Learn more
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
          <Card width={{ md: '1/2' }} level="2" padding="6">
            <Box height="full" width="full" display="flex">
              <Stack flex={1} direction="horizontal" space="3">
                <Box
                  width="3/4"
                  display="flex"
                  paddingRight="3"
                  borderRightWidth="0.375"
                >
                  <Stack flex={1} justify="space-between" space="6">
                    <Stack justify="space-between" direction="horizontal">
                      <Box
                        backgroundColor={'red'}
                        borderRadius="full"
                        width="12"
                        height="12"
                      ></Box>
                      <Stack align="flex-end">
                        <Text size="small">Your HONEY locked:</Text>
                        <Text size="small">{lockedAmount}</Text>
                      </Stack>
                    </Stack>
                    <Box marginTop="auto">
                      <Stack space="3">
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Total pHoney deposited:</Text>
                          <Text size="small">{depositedAmount}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Your pHoney balance</Text>
                          <Text size="small">{pHoneyAmount}</Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <Stack justify="space-around">
                  {wallet ? (
                      <Button
                        onClick={() => setShowPHoneyModal(true)}
                        width="full"
                        size="small"
                        variant="secondary"
                      >
                        Convert pHONEY
                      </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      Convert pHONEY
                    </Button>
                  )}
                  {wallet ? (
                      <Button
                        onClick={() => setShowVeHoneyModal(true)}
                        width="full"
                        size="small"
                        variant="secondary"
                      >
                        Lock pHONEY
                      </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      Lock pHONEY
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Stack>
        {/* Table */}
        {/* <Box
          flex={1}
          borderRadius="2xLarge"
          backgroundColor="backgroundTertiary"
        ></Box> */}
      </Stack>
    </Layout>
  );
};

export default Governance;
