import { NextPage } from 'next';
import Layout from 'components/Layout/Layout';
import { ProposalCreateView } from 'components/Proposals/ProposalCreateView/locked-voter';
import { Box, Button, IconChevronLeft, Stack } from 'degen';
import { useRouter } from 'next/router';

const ProposalCreate: NextPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <Box padding="10">
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
          <ProposalCreateView />
        </Stack>
      </Box>
    </Layout>
  );
};

export default ProposalCreate;
