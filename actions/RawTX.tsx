import { extractErrorMessage } from '@saberhq/sail';
import { Transaction } from '@solana/web3.js';
import { Box, Text, Textarea } from 'degen';

import { HelperCard } from 'components/common/HelperCard';
import type { ActionFormProps } from './types';

export const RawTX: React.FC<ActionFormProps> = ({
  setError,
  txRaw,
  setTxRaw
}: ActionFormProps) => {
  return (
    <>
      <HelperCard variant="warn">
        <Text as="p" size="base" color="yellow">
          Warning: this page is for advanced users only. Invalid transaction
          data may cause this page to freeze. Documentation will be coming soon.
        </Text>
      </HelperCard>
      <HelperCard variant="muted">
        <Box
        // tw="prose prose-sm prose-light"
        >
          <Text as="p">
            This page allows proposing any arbitrary transaction for execution
            by the DAO. The fee payer and recent blockhash will not be used.
          </Text>
        </Box>
      </HelperCard>
      <Textarea
        label="Transaction (base64)"
        id="instructionsRaw"
        rows={4}
        placeholder="Paste raw base64 encoded transaction message"
        value={txRaw}
        onChange={e => {
          setTxRaw(e.target.value);
          try {
            const buffer = Buffer.from(e.target.value, 'base64');
            const tx = Transaction.from(buffer);
            if (tx.instructions.length === 0) {
              throw new Error('no instruction data');
            }
            setError(null);
          } catch (err) {
            setError(
              `Invalid transaction data: ${
                extractErrorMessage(err) ?? '(unknown)'
              }`
            );
          }
        }}
      />
    </>
  );
};
