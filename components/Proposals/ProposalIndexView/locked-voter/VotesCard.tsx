import { Fraction } from '@saberhq/token-utils';
import type { ProposalData } from '@tribecahq/tribeca-sdk';
import { VoteSide } from '@tribecahq/tribeca-sdk';
import { Box, Spinner } from 'degen';
import BN from 'bn.js';

import { useGovernor } from 'hooks/tribeca/useGovernor';
import { Card } from 'components/common/governance/Card';
import { Meter } from 'components/common/governance/Meter';

export const VOTE_SIDE_LABEL = {
  [VoteSide.For]: 'For',
  [VoteSide.Against]: 'Against',
  [VoteSide.Abstain]: 'Abstain',
  [VoteSide.Pending]: 'Pending'
} as const;

interface Props {
  side: VoteSide.For | VoteSide.Against;
  proposal: ProposalData | null;
}

export const VotesCard: React.FC<Props> = ({ side, proposal }: Props) => {
  const { veToken } = useGovernor();
  const voteCount = !proposal
    ? null
    : side === VoteSide.For
    ? proposal.forVotes
    : side === VoteSide.Against
    ? proposal.againstVotes
    : new BN(0);

  const voteCountFmt =
    veToken && voteCount !== null ? (
      new Fraction(voteCount, 10 ** veToken.decimals).asNumber.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0
        }
      )
    ) : (
      <Spinner />
    );

  const totalDeterminingVotes = !proposal
    ? null
    : proposal.forVotes.add(proposal.againstVotes);

  return (
    <Card
      title={
        <Box display="flex" flexDirection="column" gap="3.5" width="full">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>{VOTE_SIDE_LABEL[side]}</Box>
            <Box>{voteCountFmt}</Box>
          </Box>
          <Meter
            value={voteCount ?? new BN(0)}
            max={BN.max(totalDeterminingVotes ?? new BN(0), new BN(1))}
            barColor="primary"
            // barColor={
            //   side === VoteSide.For
            //     ? theme`colors.primary`
            //     : theme`colors.red.500`
            // }
          />
        </Box>
      }
      // titleStyles={tw`h-20`}
      // link={{
      //   title: "View All",
      //   href: "",
      // }}
    />
  );
};
