import { NextPage } from 'next';
import { useState } from 'react';
import { ProposalsList } from 'components/Proposals/ProposalsList';
import Layout from 'components/Layout/Layout';

const Proposals: NextPage = () => {
  const [showDrafts, setShowDrafts] = useState(false);

  return (
    <Layout>
      <ProposalsList showDrafts={showDrafts} />
    </Layout>
  );
};

export default Proposals;
