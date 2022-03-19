import type { NextPage } from 'next';
import { Box, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const Borrow: NextPage = () => {
  return (
    <Layout>
      <Stack>
        <Box height="16" minWidth="full" gap="3" paddingTop="3">
          <Stack direction="horizontal" justify="space-between" align="center">
            <Box>
              <Stack
                direction="horizontal"
                justify="space-around"
                align="center"
              >
                <Text align="left" as="h1" variant="extraLarge" weight="bold">
                  Borrow Page
                </Text>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Borrow;
