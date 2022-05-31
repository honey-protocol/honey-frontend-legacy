import { NextPage } from 'next';
import { useState } from 'react';
import { ProposalsList } from 'components/Proposals/ProposalsList';
import Layout from 'components/Layout/Layout';
import { Button, IconPlus, Stack, Text } from 'degen';
import SmallToggleSwitch from 'components/SmallToggleSwitch/SmallToggleSwitch';
import Link from 'next/link';

const Proposals: NextPage = () => {
  const [showDrafts, setShowDrafts] = useState(true);

  return (
    <Layout>
      <Stack
        align="center"
        direction="horizontal"
        space="20"
        justify="space-between"
      >
        <Stack align="center" direction="horizontal">
          <Text variant="large">All proposals</Text>
          <Link href="/governance/proposals/create" passHref>
            <Button size="small" shape="circle">
              <IconPlus />
            </Button>
          </Link>
        </Stack>
        <Stack align="center" direction="horizontal">
          <SmallToggleSwitch
            isActive={showDrafts}
            setIsActive={setShowDrafts}
          />
          <Text variant="label">View Drafts</Text>
        </Stack>
      </Stack>
      <ProposalsList showDrafts={showDrafts} />
    </Layout>
  );
};

export default Proposals;
