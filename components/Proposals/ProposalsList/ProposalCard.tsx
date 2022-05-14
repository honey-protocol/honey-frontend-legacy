import { ProposalState } from '@tribecahq/tribeca-sdk';
import { Box, Text } from 'degen';
import Link from 'next/link';

import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { PROPOSAL_TITLE_MAX_LEN } from 'helpers/sdk/constant';
import { ActiveProposalVotingBars } from './ActiveProposalVotingBars';
import { ProposalStateBadge } from './ProposalStateBadge';
import { ProposalStateDate } from './ProposalStateDate';
import { ProposalStateLabel } from './ProposalStateLabel';
import { PulsingDot } from 'icons/PulsingDot';

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalCard: React.FC<Props> = ({ proposalInfo }: Props) => {
  // const { path } = useGovernor();
  const { state, executed } = proposalInfo.status;
  return (
    <Link
      passHref
      href={`proposals/${proposalInfo.index}`}
      // tw="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingX="6"
        paddingY="5"
        // as={Link}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="5"
          width={{ md: '192', xs: '3/4' }}
          // tw="flex items-center gap-5 w-3/4 md:w-[500px]"
        >
          {state === ProposalState.Active && <PulsingDot color="decendent" />}
          <div>
            <Box display="flex" alignItems="center">
              <Text
                color="white"
                lineHeight="1.375"
                // tw="text-white leading-snug break-words hyphens[auto]"
              >
                {proposalInfo.proposalMetaData?.title.slice(
                  0,
                  PROPOSAL_TITLE_MAX_LEN
                )}
              </Text>
            </Box>
            {proposalInfo.proposalData && state !== null && (
              <Box
                display="flex"
                flexDirection={{ md: 'row', xs: 'column' }}
                alignItems={{ md: 'center' }}
                marginTop={{ md: '4', xs: '2' }}
                gap="2"
              >
                <ProposalStateLabel state={state} executed={executed} />
                <Box
                  display="flex"
                  gap="1"
                  fontSize="small"
                  fontWeight="semiBold"
                >
                  <Text as="span">{`000${proposalInfo.index}`.slice(-4)}</Text>
                  <Text as="span">&middot;</Text>
                  <ProposalStateDate proposalInfo={proposalInfo} />
                </Box>
              </Box>
            )}
          </div>
        </Box>
        {state === ProposalState.Active && (
          <Box width="192">
            <ActiveProposalVotingBars proposal={proposalInfo} />
          </Box>
        )}
        {state !== null &&
          state !== ProposalState.Draft &&
          state !== ProposalState.Active && (
            <Box width={{ sm: '16', md: '20', lg: '40' }}>
              <ProposalStateBadge status={proposalInfo.status} />
            </Box>
          )}
      </Box>
    </Link>
  );
};
