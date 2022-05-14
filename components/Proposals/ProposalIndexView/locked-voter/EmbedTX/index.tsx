import type { PublicKey } from '@solana/web3.js';
import { Box, Spinner } from 'degen';

import { useParsedTXByKey } from 'hooks/useParsedTX';
import { SmartWalletProvider } from 'hooks/useSmartWallet';
// import { TransactionProvider } from '../../../../../wallet/tx/TransactionView/context';
import { InstructionsInner } from './InstructionsInner';

interface Props {
  txKey: PublicKey;
}

export const EmbedTX: React.FC<Props> = ({ txKey }: Props) => {
  const { data: parsedTX, isLoading } = useParsedTXByKey(txKey);
  return (
    <Box paddingY="6">
      {isLoading && !parsedTX && <Spinner />}
      {parsedTX && (
        <SmartWalletProvider initialState={parsedTX.tx.account.smartWallet}>
          {/* <TransactionProvider initialState={parsedTX}>
            <InstructionsInner />
          </TransactionProvider> */}
        </SmartWalletProvider>
      )}
    </Box>
  );
};
