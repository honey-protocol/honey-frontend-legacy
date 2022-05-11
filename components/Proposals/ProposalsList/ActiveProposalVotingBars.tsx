import { Box, Spinner } from 'degen';
import BN from 'bn.js';

import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { formatNumberSI } from 'helpers/format';
// import { Meter } from '../../../../../common/Meter';

interface Props {
  proposal: ProposalInfo;
}

export const ActiveProposalVotingBars: React.FC<Props> = ({
  proposal
}: Props) => {
  const { veToken } = useGovernor();
  if (!veToken) {
    return <Spinner />;
  }
  const forVotes = proposal.proposalData.forVotes
    .div(new BN(10 ** veToken.decimals))
    .toNumber();
  const againstVotes = proposal.proposalData.againstVotes
    .div(new BN(10 ** veToken.decimals))
    .toNumber();
  const maxVotes = Math.max(forVotes, againstVotes, 1);
  return (
    <Box display="flex" flexDirection="column">
      <Box
        width="full"
        display="flex"
        alignItems="center"
        height="6"
        fontWeight="medium"
        color="white"
      >
        {/* <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6"> */}
        {/* <Meter
          value={forVotes}
          max={maxVotes}
          barColor={theme`colors.primary`}
        /> */}
        {/* <div tw="flex-basis[44px]"> */}
        {formatNumberSI(forVotes)}
        {/* </div> */}
      </Box>
      <Box
        width="full"
        display="flex"
        alignItems="center"
        height="6"
        fontWeight="medium"
        color="white"
      >
        {/* <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6"> */}
        {/* <Meter
          value={againstVotes}
          max={maxVotes}
          barColor={theme`colors.red.500`}
        /> */}
        {/* <div tw="flex-basis[44px]"> */}
        {formatNumberSI(againstVotes)}
        {/* </div> */}
      </Box>
    </Box>
  );
};
