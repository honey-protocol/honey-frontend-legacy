import { useSolana } from '@saberhq/use-solana';
import type { TransactionSignature } from '@solana/web3.js';
import { useQueries } from 'react-query';

export const useTransactions = (txSigs: TransactionSignature[]) => {
  const { network, connection } = useSolana();
  return useQueries(
    txSigs.map(sig => {
      return {
        queryKey: ['txSig', network, sig],
        queryFn: async () => {
          const tx = await connection.getTransaction(sig, {
            commitment: 'confirmed'
          });
          if (!tx) {
            return null;
          }
          return {
            sig,
            tx
          };
        }
      };
    })
  );
};
