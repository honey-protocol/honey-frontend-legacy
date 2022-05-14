import { Box } from 'degen';
// import { useTransaction } from '../../../../../wallet/tx/TransactionView/context';
import { InstructionPreview } from './InstructionPreview';

export const InstructionsInner: React.FC = () => {
  // const { instructions } = useTransaction();
  return (
    <Box display="grid" gap="4">
      {/* {instructions?.map((instruction, i) => (
        <InstructionPreview
          key={`ix_${i}`}
          instruction={instruction}
          index={i}
        />
      ))} */}
    </Box>
  );
};
