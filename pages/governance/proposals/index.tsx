import { NextPage } from 'next';
import { useState } from 'react';
import { ProposalsList } from 'components/Proposals/ProposalsList';
import Layout from 'components/Layout/Layout';
import { Box, Button, IconChevronLeft, IconPlus, Stack, Text } from 'degen';
import SmallToggleSwitch from 'components/SmallToggleSwitch/SmallToggleSwitch';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Proposals: NextPage = () => {
  const [showDrafts, setShowDrafts] = useState(true);
  const router = useRouter();

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
            <Stack space="2" direction="horizontal">
              <Text variant="large" weight="semiBold">
                All proposals
              </Text>
              <Stack align="center" direction="horizontal">
                <SmallToggleSwitch
                  isActive={showDrafts}
                  setIsActive={setShowDrafts}
                />
                <Text variant="label">View Drafts</Text>
              </Stack>
            </Stack>
            <Link href="/governance/proposals/create" passHref>
              <Button variant="secondary" prefix={<IconPlus />} size="small">
                New proposal
              </Button>
            </Link>
          </Stack>
          <ProposalsList showDrafts={showDrafts} />
        </Stack>
      </Box>
    </Layout>
  );
};

export default Proposals;
