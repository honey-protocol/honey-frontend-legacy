import type { NextPage } from 'next';
import { Box, Button, Card, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import ModalContainer from 'components/ModalContainer/ModalContainer';

const Governance: NextPage = () => {
  return (
    <Layout>
      <Stack space="5" flex={1}>
        <ModalContainer>
          <Box width="80" height="96">
            <Text>Manage locked HONEY</Text>
          </Box>
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
            <Stack space="5">
              <Text variant="small" align="center">
                To vote for collection to be added as collaterals, You can lock
                HONEY for a{' '}
                <Text as="span" color="accent">
                  minimum of one week
                </Text>{' '}
                and receive veHONEY which can be staked as votes in collection
                honey jars for voting duration.{' '}
                <Text as="span" color="accent">
                  Five new collections{' '}
                </Text>
                will be added every week
              </Text>
              <Stack direction="horizontal" justify="space-between">
                <Stack space="0" align="center">
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
                </Stack>
              </Stack>
            </Stack>
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
                    Get HONEY
                  </Button>
                  <Button width="full" size="small" variant="primary">
                    Stake pHONEY
                  </Button>
                  <Button width="full" size="small" variant="secondary">
                    Claim veHONEY
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
