import { Box } from 'degen';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { ProposalStateDate } from './ProposalStateDate';
import { ProposalStateLabel } from './ProposalStateLabel';

interface Props {
  className?: string;
  proposalInfo: ProposalInfo;
}

export const ProposalSubtitle: React.FC<Props> = ({
  proposalInfo,
  className
}: Props) => {
  const { state, executed } = proposalInfo.status;
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="2"
      marginTop="2"
      className={className}
    >
      <ProposalStateLabel state={state} executed={executed} />
      <Box display="flex" gap="1" fontSize="small" fontWeight="semiBold">
        <span>{`000${proposalInfo.index}`.slice(-4)}</span>
        <span>&middot;</span>
        <ProposalStateDate proposalInfo={proposalInfo} />
      </Box>
    </Box>
  );
};
