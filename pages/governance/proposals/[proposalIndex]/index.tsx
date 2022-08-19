  import { NextPage } from 'next';
import Layout from 'components/Layout/Layout';
import { ProposalIndexView } from 'components/Proposals/ProposalIndexView';
import { Button, IconChevronLeft, Stack } from 'degen';
import { useRouter } from 'next/router';

const Proposals: NextPage = () => {
  const router = useRouter();
  return (
    <Layout>
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
        <ProposalIndexView />
      </Stack>
    </Layout>
  );
};

export default Proposals;
