import { findSubaccountInfoAddress } from '@gokiprotocol/client';
import type { PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { useSubaccountInfoData } from 'helpers/parser';

export const useSubaccountInfo = (key: PublicKey | null | undefined) => {
  const { data: subaccountInfoKey } = useQuery(
    ['subaccountInfoKey', key?.toString()],
    async (): Promise<PublicKey> => {
      invariant(key);
      const [sub] = await findSubaccountInfoAddress(key);
      return sub;
    },
    {
      enabled: !!key
    }
  );
  return useSubaccountInfoData(subaccountInfoKey);
};
