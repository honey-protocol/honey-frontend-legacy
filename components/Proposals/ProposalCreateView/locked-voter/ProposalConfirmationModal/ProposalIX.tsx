import type { TransactionInstruction } from '@solana/web3.js';
import { Box } from 'degen';

import { useParsedInstruction } from 'hooks/useParsedInstruction';

interface Props {
  ix: TransactionInstruction;
}

export const ProposalIX: React.FC<Props> = ({ ix }: Props) => {
  const parsedIX = useParsedInstruction(ix);
  return (
    <Box
      opacity="50"
      paddingX="4"
      paddingY="2"
      fontSize="small"
      fontWeight="semiBold"
    >
      {parsedIX.title}
    </Box>
  );
};
