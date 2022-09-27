import {
  buildStubbedTransaction,
  createMemoInstruction
} from '@saberhq/solana-contrib';
import { useSolana } from '@saberhq/use-solana';
import { useEffect, useState } from 'react';
import { Text, Textarea } from 'degen';
import { serializeToBase64 } from 'helpers/utils';
import type { ActionFormProps } from './types';

export const Memo: React.FC<ActionFormProps> = ({
  actor,
  setError,
  setTxRaw
}: ActionFormProps) => {
  const [memo, setMemo] = useState<string>('');
  const { network } = useSolana();

  useEffect(() => {
    if (memo === '') {
      setError('Memo cannot be empty');
    }
  }, [memo, setError]);

  return (
    <>
      <Textarea
        id="memo"
        // tw="h-auto"
        label="Memo"
        rows={4}
        placeholder="The memo for the DAO to send."
        value={memo}
        onChange={e => {
          setMemo(e.target.value);
          try {
            const txStub = buildStubbedTransaction(
              network !== 'localnet' ? network : 'devnet',
              [createMemoInstruction(e.target.value, [actor])]
            );
            setTxRaw(serializeToBase64(txStub));
            setError(null);
          } catch (ex) {
            setTxRaw('');
            console.debug('Error creating memo', ex);
            setError('Memo is too long');
          }
        }}
      />
    </>
  );
};
