import { useSolana } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import { findVoteAddress } from '@tribecahq/tribeca-sdk';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { useParsedVote } from 'helpers/parser';

export const useVote = (proposalKey?: PublicKey, voter?: PublicKey) => {
  const { network } = useSolana();
  const voteKey = useQuery(
    ['voteKey', network, proposalKey?.toString(), voter?.toString()],
    async () => {
      invariant(proposalKey && voter);
      const [escrowKey] = await findVoteAddress(proposalKey, voter);
      return escrowKey;
    },
    {
      enabled: !!(proposalKey && voter)
    }
  );
  return useParsedVote(voteKey.data);
};
