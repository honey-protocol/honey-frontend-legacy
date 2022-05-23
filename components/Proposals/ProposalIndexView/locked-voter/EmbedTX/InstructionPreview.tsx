import { Box, Text } from 'degen';
import { startCase } from 'lodash';

import { useParsedInstruction } from 'hooks/useParsedInstruction';
import type { ParsedInstruction } from 'hooks/useSmartWallet';
import { shortenAddress } from 'helpers/utils';
import { AddressLink } from 'components/AddressLink';
import { InstructionDisplay } from 'components/tx/TransactionView/TransactionIndexView/InstructionDisplay';
// import { InstructionDisplay } from '../../../../../wallet/tx/TransactionView/TransactionIndexView/InstructionDisplay';

interface Props {
  index: number;
  instruction: ParsedInstruction;
}

export const InstructionPreview: React.FC<Props> = ({
  instruction,
  index
}: Props) => {
  const parsed = useParsedInstruction(instruction.ix);
  return (
    <Box
      display="grid"
      borderRadius="medium"
      borderWidth="px"
      // tw="grid border dark:border-warmGray-700 rounded"
    >
      <Box fontSize="small" padding="4">
        <Text
          as="h2"
          weight="semiBold"
          // tw="font-semibold text-gray-800 dark:text-white mb-2"
        >
          IX #{index + 1}:{' '}
          {parsed?.title ??
            startCase(
              (instruction.parsed && 'name' in instruction.parsed
                ? instruction.parsed.name
                : null) ?? 'Unknown'
            )}
        </Text>
        <Text as="p" size="small">
          <Text as="span" weight="medium">
            Program:
          </Text>{' '}
          <AddressLink
            // tw="font-semibold text-secondary"
            address={instruction.ix.programId}
          >
            {instruction.programName} (
            {shortenAddress(instruction.ix.programId.toString())})
          </AddressLink>
        </Text>
      </Box>
      <Box
        padding="4"
        borderTopWidth="px"
        // tw="p-4 border-t dark:border-t-warmGray-600"
      >
        <InstructionDisplay parsed={parsed} instruction={instruction} />
      </Box>
    </Box>
  );
};
