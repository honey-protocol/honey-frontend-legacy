import { Box as DegenBox } from 'degen';
import type { RichParsedInstruction } from 'hooks/useParsedInstruction';
import type { ParsedInstruction } from 'hooks/useSmartWallet';
import { Box } from './Box';
import { IXAccounts } from './IXAccounts';
import { IXArguments } from './IXArguments';
// import { IXData } from './IXData';

interface Props {
  instruction: ParsedInstruction;
  parsed: RichParsedInstruction;
}

export const InstructionDisplay: React.FC<Props> = ({
  instruction,
  parsed
}: Props) => {
  return (
    <DegenBox display="grid" gap="4">
      {/* {parsed.data.type === 'raw' && (
        <IXData
          data={Buffer.from(parsed.data.data)}
          error={
            instruction.parsed && 'error' in instruction.parsed
              ? instruction.parsed.error
              : null
          }
        />
      )} */}
      {parsed.data.type === 'anchor' && <IXArguments args={parsed.data.args} />}
      {/* {parsed.data.type === 'object' && (
        <Box title="Arguments">
          <AttributeList
            attributes={parsed.data.args as Record<string, unknown>}
          />
        </Box>
      )} */}
      <IXAccounts accounts={parsed.accounts} />
    </DegenBox>
  );
};
