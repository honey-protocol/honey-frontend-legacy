import { NextPage } from 'next';
import { useState } from 'react';
import { ProposalsList } from 'components/Proposals/ProposalsList';
import Layout from 'components/Layout/Layout';
import { Box, Button, IconChevronLeft, IconPlus, Stack, Text } from 'degen';
import SmallToggleSwitch from 'components/SmallToggleSwitch/SmallToggleSwitch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

const Proposals: NextPage = () => {
  const [showDrafts, setShowDrafts] = useState(true);
  const router = useRouter();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  return (
    <Layout>
      <Box padding="5">
        <Stack space="5">
          <Button
            onClick={router.back}
            size="small"
            variant="transparent"
            rel="noreferrer"
            prefix={<IconChevronLeft />}
          >
            Back
          </Button>
          <Stack
            align="center"
            direction="horizontal"
            space="20"
            justify="space-between"
          >
            <Stack align="center" direction="horizontal">
              <Text variant="label">View Drafts</Text>
              <SmallToggleSwitch
                isActive={showDrafts}
                setIsActive={setShowDrafts}
              />
            </Stack>
            {/* commented out the new proposal button
                  {wallet?.connected ? (
              <Link href="/governance/proposals/create" passHref>
                <Button variant="secondary" prefix={<IconPlus />} size="small">
                  New proposal
                </Button>
              </Link>
            ) : (
              <Button
                onClick={connect}
                variant="secondary"
                prefix={<IconPlus />}
                size="small"
              >
                New proposal
              </Button>
            )} */}
          </Stack>
          <Box backgroundColor="background" borderRadius="2xLarge" padding="6">
            <ProposalsList showDrafts={showDrafts} />
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
};

export default Proposals;
