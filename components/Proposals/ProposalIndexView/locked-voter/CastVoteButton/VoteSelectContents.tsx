import { Box, Button, Text, Textarea } from 'degen';
import { VoteSide } from 'helpers/dao';
import { sum } from 'lodash';
import invariant from 'tiny-invariant';

import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { FORMAT_VOTE_PERCENT } from 'helpers/format';
import { HelperCard } from 'components/common/HelperCard';
import { sideColor } from 'helpers/utils';
import { VOTE_SIDE_LABEL } from '../VotesCard';
import { Meter } from 'components/common/governance/Meter';

interface Props {
  proposal: ProposalInfo;

  side: VoteSide | null;
  setSide: (side: VoteSide) => void;
  reason: string;
  setReason: (reason: string) => void;
}

export const VoteSelectContents: React.FC<Props> = ({
  proposal,
  side,
  setSide,
  reason,
  setReason
}: Props) => {
  const allVotes = (['forVotes', 'againstVotes', 'abstainVotes'] as const).map(
    vote => proposal.proposalData[vote].toNumber()
  );
  const totalVotes = sum(allVotes);
  return (
    <Box display="grid" gap="4">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text as="h2" color="white" weight="semiBold">
          Your Ballot for Proposal #{proposal.index}
        </Text>
      </Box>
      <HelperCard variant="muted">
        <Text as="p">Select one of the options below to cast your vote.</Text>
      </HelperCard>
      <Box display="flex" flexDirection="column" gap="4" width="full">
        {([VoteSide.For, VoteSide.Against, VoteSide.Abstain] as const).map(
          (voteSide, i) => {
            const myVotes = allVotes[i];
            invariant(typeof myVotes === 'number');
            const percent = FORMAT_VOTE_PERCENT.format(
              totalVotes === 0 ? 0 : myVotes / totalVotes
            );
            return (
              <Button
                // tw="flex items-center gap-4 px-5 py-4 border rounded border-warmGray-600 transition-all"
                key={voteSide}
                width="full"
                onClick={() => setSide(voteSide)}
                variant={side === voteSide ? 'primary' : 'tertiary'}
                prefix={<Text>{VOTE_SIDE_LABEL[voteSide]}</Text>}
                suffix={<Text>{percent}</Text>}
                center
              >
                {/* <Box
                  display="flex"
                  alignItems="center"
                  gap="4"
                  paddingX="5"
                  paddingY="4"
                  width="full"
                > */}
                {/* <Box
                  display="flex"
                  flexDirection="column"
                  flexGrow={1}
                  // alignItems="center"
                  gap="4"
                  paddingX="5"
                  paddingY="4"
                  width="full"
                > */}
                {/* <Box
                  width="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box color="white" fontWeight="medium">
                    {VOTE_SIDE_LABEL[voteSide]}
                  </Box>
                  <Box fontWeight="medium" color="accentText">
                    {percent}
                  </Box>
                </Box> */}
                <Meter
                  value={myVotes}
                  max={totalVotes === 0 ? 1 : totalVotes}
                  barColor={sideColor(voteSide)}
                />
              </Button>
            );
          }
        )}
      </Box>
      <Box marginTop="8">
        {/* <label htmlFor="reason" tw="flex flex-col gap-2"> */}
        {/* <span tw="font-medium text-white text-sm">
            Add Reason (max 200 characters)
          </span> */}
        <Textarea
          id="reason"
          label={
            <Text as="span" color="white" size="small" weight="medium">
              Add reason (max 200 characters)
            </Text>
          }
          hideLabel
          // tw="resize-none h-auto"
          maxLength={200}
          placeholder="Tell others why you are voting this way"
          rows={4}
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        {/* </label> */}
      </Box>
    </Box>
  );
};
