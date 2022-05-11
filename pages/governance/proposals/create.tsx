import { NextPage } from 'next';
import Layout from 'components/Layout/Layout';
import { ProposalCreateView } from 'components/Proposals/ProposalCreateView/locked-voter';

const ProposalCreate: NextPage = () => {
  return (
    <Layout>
      <ProposalCreateView />
    </Layout>
  );
};

export default ProposalCreate;
