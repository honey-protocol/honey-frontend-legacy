import { useSail } from '@saberhq/sail';
import BN from 'bn.js';
import invariant from 'tiny-invariant';

import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { Card } from 'components/common/governance/Card';
import { Box, Button, Text } from 'degen';
// import { AsyncButton } from '../../../../../../common/AsyncButton';

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalQueue: React.FC<Props> = ({
  proposal,
  onActivate
}: Props) => {
  const { governorW } = useGovernor();
  const { handleTX } = useSail();

  const votingEndedAt = new Date(
    proposal.proposalData.votingEndsAt.toNumber() * 1_000
  );

  return (
    <Card title="Proposal Passed">
      <Box paddingX="7" paddingY="4" fontSize="small">
        <Box marginBottom="4">
          <Text as="p">
            The proposal passed successfully on {votingEndedAt.toLocaleString()}
            .
          </Text>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            width="3/4"
            disabled={!governorW}
            variant="primary"
            size="small"
            onClick={async () => {
              invariant(governorW);
              const tx = await governorW.queueProposal({
                index: new BN(proposal.index)
              });
              const { pending, success } = await handleTX(tx, 'Queue Proposal');
              if (!pending || !success) {
                return;
              }
              await pending.wait();
              onActivate();
            }}
          >
            Queue Proposal
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
