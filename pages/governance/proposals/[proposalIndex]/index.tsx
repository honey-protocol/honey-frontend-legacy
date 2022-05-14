import { NextPage } from 'next';
import Layout from 'components/Layout/Layout';
import { ProposalIndexView } from 'components/Proposals/ProposalIndexView';

const Proposals: NextPage = () => {
  return (
    <Layout>
      <ProposalIndexView />
    </Layout>
  );
};

export default Proposals;
