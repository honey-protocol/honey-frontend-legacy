import { VoteSide } from 'helpers/dao';

import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { ModalButton } from 'components/Modal/ModalButton';
import { CastVoteModal } from './CastVoteModal';

interface Props {
  proposalInfo: ProposalInfo;
  side: VoteSide | null;
}

export const CastVoteButton: React.FC<Props> = ({
  proposalInfo,
  side
}: Props) => {
  return (
    <ModalButton
      // tw="max-w-md"
      buttonProps={{
        size: 'small',
        width: '1/2'
        // css: tw`border-white w-2/5 hover:(border-primary bg-primary bg-opacity-20)`
      }}
      buttonLabel={
        side === null // Vote account not yet created
          ? 'Cast Vote'
          : side === VoteSide.Pending
          ? 'Cast Vote'
          : 'Change Vote'
      }
    >
      <CastVoteModal proposalInfo={proposalInfo} />
    </ModalButton>
  );
};
