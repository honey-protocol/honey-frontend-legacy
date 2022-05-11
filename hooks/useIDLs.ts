import { useSolana } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import { useQueries } from 'react-query';
import invariant from 'tiny-invariant';

import { fetchIDL } from 'helpers/fetchers';
import { KNOWN_NON_ANCHOR_PROGRAMS } from 'helpers/utils';

export const useIDLs = (idls: (PublicKey | null | undefined)[]) => {
  const { connection } = useSolana();
  return useQueries(
    idls.map(pid => ({
      queryKey: ['idl', pid?.toString()],
      queryFn: async () => {
        invariant(pid);
        if (KNOWN_NON_ANCHOR_PROGRAMS.has(pid.toString())) {
          return { programID: pid, idl: null };
        }
        return {
          programID: pid,
          idl: await fetchIDL(connection, pid.toString())
        };
      },
      enabled: !!pid,
      staleTime: Infinity
    }))
  );
};

export const useIDL = (address: PublicKey | null | undefined) => {
  const ret = useIDLs([address])[0];
  invariant(ret);
  return ret;
};
