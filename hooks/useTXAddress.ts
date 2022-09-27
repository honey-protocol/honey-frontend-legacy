import { findTransactionAddress } from '@gokiprotocol/client';
import type { PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';

export const useTXAddress = (smartWalletKey: PublicKey, index: number) => {
  return useQuery(
    ['parsedTXAddress', smartWalletKey.toString(), index],
    async () => {
      const [txKey] = await findTransactionAddress(smartWalletKey, index);
      return txKey;
    }
  );
};
