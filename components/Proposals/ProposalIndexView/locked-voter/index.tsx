import { ProposalState, VoteSide } from 'helpers/dao';
import { noop } from 'lodash';
import { useRouter } from 'next/router';

import { useProposal } from 'hooks/tribeca/useProposals';
// import { ContentLoader } from '../../../../../common/ContentLoader';
import { GovernancePage } from 'components/common/governance/GovernancePage';
// import { Profile } from 'components/common/governance/Profile';
// import { PlaceholderSubtitle } from '../../../GovernanceOverviewView/locked-voter/ProposalsList/PlaceholderCard';
// import { ProposalSubtitle } from '../../../GovernanceOverviewView/locked-voter/ProposalsList/ProposalSubtitle';
import { ProposalActivate } from './actions/ProposalActivate';
import { ProposalExecute } from './actions/ProposalExecute';
import { ProposalQueue } from './actions/ProposalQueue';
import { ProposalVote } from './actions/ProposalVote';
import { ProposalDetails } from './ProposalDetails';
// import { ProposalHelmet } from './ProposalHelmet';
import { ProposalHistory } from './ProposalHistory';
import { VotesCard } from './VotesCard';
import { Box, Stack, Text } from 'degen';

export const ProposalIndexView: React.FC = () => {
  const router = useRouter();
  const proposalIndexStr = router.query.proposalIndex as string;
  const { info: proposalInfo } = useProposal(parseInt(proposalIndexStr));

  return (
    <GovernancePage
      title={
        <Text
          as="h1"
          size="extraLarge"
          weight="semiBold"
          color="white"
          // tw="text-2xl md:text-3xl font-bold text-white tracking-tighter"
        >
          <Box
            // minHeight="36px"
            display="flex"
            alignItems="center"
            // tw="min-h-[36px] flex items-center break-words hyphens[auto]"
          >
            {proposalInfo ? (
              proposalInfo?.proposalMetaData?.title ?? 'Proposal'
            ) : (
              <div></div>
              // <ContentLoader tw="w-40 h-7" />
            )}
          </Box>
        </Text>
      }
      header={
        <Box display="flex" alignItems="center" gap="2" marginTop="2">
          {/* <Box
          //  tw="min-h-[20px]"
          >
            {proposalInfo ? (
              <ProposalSubtitle proposalInfo={proposalInfo} />
            ) : (
              <PlaceholderSubtitle />
            )}
          </Box> */}
        </Box>
      }
      right={
        proposalInfo ? (
          <Box borderRadius="medium" padding="3">
            {/* <Profile address={proposalInfo.proposalData.proposer} /> */}
          </Box>
        ) : undefined
      }
    >
      {/* {proposalInfo && <ProposalHelmet proposalInfo={proposalInfo} />} */}
      <Box display="grid" gap="4" marginBottom="20">
        <Stack
          direction="horizontal"
          // tw="grid md:grid-cols-2 gap-4"
        >
          <Box flex={1}>
            <VotesCard
              side={VoteSide.For}
              proposal={proposalInfo ? proposalInfo.proposalData : null}
            />
          </Box>
          <Box flex={1}>
            <VotesCard
              side={VoteSide.Against}
              proposal={proposalInfo ? proposalInfo.proposalData : null}
            />
          </Box>
        </Stack>
        <Box
          display="flex"
          flexDirection={{ sm: 'column', md: 'row' }}
          alignItems={{ md: 'flex-start' }}
          gap="4"
          // tw="flex flex-col md:(flex-row items-start) gap-4"
        >
          <Box display="flex" width="1/2" flexDirection="column" gap="4">
            <ProposalDetails proposalInfo={proposalInfo} />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width="1/2"
            gap="4"
            // tw="w-full md:w-[350px] flex flex-col gap-4"
          >
            {proposalInfo?.status.state === ProposalState.Draft && (
              <ProposalActivate proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Active && (
              <ProposalVote proposalInfo={proposalInfo} onVote={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Succeeded && (
              <ProposalQueue proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Queued && (
              <ProposalExecute proposal={proposalInfo} onActivate={noop} />
            )}
            <ProposalHistory proposalInfo={proposalInfo} />
          </Box>
        </Box>
      </Box>
    </GovernancePage>
  );
};
