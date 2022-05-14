import { Box, Button, Text, Textarea } from 'degen';
import { VoteSide } from '@tribecahq/tribeca-sdk';
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
                // css={[
                //   side === voteSide && {
                //     borderColor: sideColor(voteSide)
                //   }
                // ]}
                onClick={() => setSide(voteSide)}
              >
                <Box>
                  <Box
                    width="6"
                    height="6"
                    // css={[tw`border border-gray-500`, tw`w-6 h-6`]}
                  >
                    <svg
                      // tw="w-full h-full"
                      // css={[
                      //   css`
                      //     stroke-width: 15px;
                      //     fill: none;
                      //     & > path {
                      //       stroke: ${sideColor(voteSide)};
                      //     }
                      //   `,
                      //   side === voteSide &&
                      //     css`
                      //       & > path {
                      //         stroke-dashoffset: 0;
                      //         transition: stroke-dashoffset 0.1s ease-in 0s;
                      //       }
                      //     `
                      // ]}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {voteSide === VoteSide.For ? (
                        <path
                          d="M 10 50 L 40 86 L 90 10"
                          strokeDasharray="140"
                          strokeDashoffset="140"
                        ></path>
                      ) : (
                        <>
                          <path
                            d="M 10 10 L 90 90"
                            strokeDasharray="113"
                            strokeDashoffset="113"
                          ></path>
                          <path
                            d="M 90 10 L 10 90"
                            strokeDasharray="113"
                            strokeDashoffset="113"
                          ></path>
                        </>
                      )}
                    </svg>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                  <Box
                    width="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box color="white" fontWeight="medium">
                      {VOTE_SIDE_LABEL[voteSide]}
                    </Box>
                    <Box fontWeight="medium" color="accentText">
                      {percent}
                    </Box>
                  </Box>
                  <Meter
                    value={myVotes}
                    max={totalVotes === 0 ? 1 : totalVotes}
                    barColor={sideColor(voteSide)}
                  />
                </Box>
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
