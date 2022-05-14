import { ProposalState } from '@tribecahq/tribeca-sdk';
import { Box, BoxProps, Text } from 'degen';
import { startCase } from 'lodash';

interface Props {
  state: ProposalState;
  executed?: boolean;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: 'active',
  [ProposalState.Draft]: 'draft',
  [ProposalState.Canceled]: 'canceled',
  [ProposalState.Defeated]: 'failed',
  [ProposalState.Succeeded]: 'passed',
  [ProposalState.Queued]: 'queued'
};

export const ProposalStateLabel: React.FC<Props> = ({
  state,
  executed
}: Props) => {
  let borderColor: BoxProps['color'] = 'inherit';
  let textColor: BoxProps['color'] = 'inherit';
  if (
    state === ProposalState.Canceled ||
    state === ProposalState.Defeated ||
    state === ProposalState.Draft
  ) {
    borderColor = 'text';
    textColor = 'text';
  }
  if (
    executed ||
    state === ProposalState.Succeeded ||
    state === ProposalState.Queued
  ) {
    borderColor = 'green';
    textColor = 'green';
  }
  return (
    <Box
      borderWidth="px"
      borderRadius="medium"
      paddingY="0.5"
      width="16"
      borderColor={borderColor}
    >
      <Text size="small" align="center" color={textColor}>
        {startCase(executed ? 'executed' : STATE_LABELS[state])}
      </Text>
    </Box>
  );
};
