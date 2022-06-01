import type { TransactionInstruction } from '@solana/web3.js';
import { Box, Text } from 'degen';

import { useParsedInstruction } from 'hooks/useParsedInstruction';

interface Props {
  ix: TransactionInstruction;
}

export const ProposalIX: React.FC<Props> = ({ ix }: Props) => {
  const parsedIX = useParsedInstruction(ix);
  return (
    <Box opacity="50" fontSize="small" fontWeight="semiBold" width="fit">
      <Text as="span">{parsedIX.title}</Text>
    </Box>
  );
};
