import type { NextPage } from 'next';
import { Box, Button, Card, IconExclamation, Input, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useState } from 'react';
import PHoneyModal from 'components/PHoneyModal';
import VeHoneyModal from 'components/VeHoneyModal';

const Governance: NextPage = () => {
  const [showPHoneyModal, setShowPHoneyModal] = useState(false);
  const [showVeHoneyModal, setShowVeHoneyModal] = useState(false);

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
                  pre-IDO HONEY (pHONEY) has to be deposited before the IDO on
                  March 30th You can{' '}
                  <Text as="span" color="accent">
                    stake it for HONEY or vest it for veHONEY.
                  </Text>{' '}
                  Check out our docs to learn the difference between HONEY and
                  veHONEY
                </Text>
                <Stack direction="horizontal" justify="center" align="center">
                  <Button
                    as="a"
                    href="https://docs.honey.finance/"
                    target="_blank"
                    size="small"
                    variant="tertiary"
                  >
                    Learn more
                  </Button>
                  {/* <Stack space="0" align="center">
                  <Text variant="small">Total HONEY locked</Text>
                  <Text variant="large" weight="bold">
                    22, 236, 780
                  </Text>
                </Stack>
                <Stack space="0" align="center">
                  <Text variant="small">Total HONEY locked</Text>
                  <Text variant="large" weight="bold">
                    22, 236, 780
                  </Text>
                </Stack> */}
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
                        <Text size="small">Your total HONEY</Text>
                        <Text size="small">236, 780</Text>
                      </Stack>
                    </Stack>
                    <Box marginTop="auto">
                      <Stack space="3">
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Total locked:</Text>
                          <Text size="small">125,987</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Total locked:</Text>
                          <Text size="small">125,987</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Total locked:</Text>
                          <Text size="small">125,987</Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <Stack justify="space-between">
                  <Button width="full" size="small" variant="secondary">
                    {' '}
                  </Button>
                  <Button
                    onClick={() => setShowPHoneyModal(true)}
                    width="full"
                    size="small"
                    variant="secondary"
                  >
                    Stake pHONEY
                  </Button>
                  <Button
                    onClick={() => setShowVeHoneyModal(true)}
                    width="full"
                    size="small"
                    variant="secondary"
                  >
                    Get veHONEY
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Stack>
        {/* Table */}
        <Box
          flex={1}
          borderRadius="2xLarge"
          backgroundColor="backgroundTertiary"
        ></Box>
      </Stack>
    </Layout>
  );
};

export default Governance;
