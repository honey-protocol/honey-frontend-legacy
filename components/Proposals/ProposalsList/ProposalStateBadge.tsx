import { ProposalState } from 'helpers/dao';
import { startCase } from 'lodash';
import {
  IconCheck,
  IconPencil,
  IconClose,
  IconRefresh,
  Box,
  Text
} from 'degen';
import type { ProposalStatus } from 'hooks/tribeca/useProposals';

interface Props {
  status: ProposalStatus;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: 'active',
  [ProposalState.Draft]: 'draft',
  [ProposalState.Canceled]: 'canceled',
  [ProposalState.Defeated]: 'failed',
  [ProposalState.Succeeded]: 'passed',
  [ProposalState.Queued]: 'queued'
};

const getStateIcon = (state: ProposalState): React.ReactNode => {
  switch (state) {
    case ProposalState.Active:
      return (
        <Box
          borderRadius="full"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="accent"
          width="6"
          height="6"
        >
          <IconRefresh size="6" />
        </Box>
      );
    case ProposalState.Canceled:
    case ProposalState.Defeated:
      return (
        <Box
          borderRadius="full"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="accentSecondary"
          width="6"
          height="6"
        >
          <IconClose size="6" />
        </Box>
      );
    case ProposalState.Draft:
      return (
        <Box
          borderRadius="full"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="accentSecondary"
          width="6"
          height="6"
        >
          <IconPencil size="6" />
        </Box>
      );
    default:
      return (
        <Box
          borderRadius="full"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="accent"
          width="6"
          height="6"
        >
          <IconCheck size="6" />
        </Box>
      );
  }
};

export const ProposalStateBadge: React.FC<Props> = ({ status }: Props) => {
  const { executed, state } = status;
  return (
    <Box
      display="flex"
      flexDirection={{ lg: 'row', md: 'column' }}
      alignItems="center"
      gap={{ lg: '5', md: '1' }}
    >
      {getStateIcon(state)}
      <Text as="span" size="small" color="white">
        {startCase(executed ? 'executed' : STATE_LABELS[state])}
      </Text>
    </Box>
  );
};
