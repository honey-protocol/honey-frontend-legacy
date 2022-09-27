import { TokenAmount } from '@saberhq/token-utils';
import { useSolana } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import { VoteEscrow } from 'helpers/dao';
import { useEscrowData, useLockerData } from 'helpers/parser';
import { findEscrowAddress, useSDK } from 'helpers/sdk';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { useGovernor } from './useGovernor';

export const useLocker = () => {
  const { governorData } = useGovernor();
  const lockerKey = governorData
    ? governorData.account.electorate
    : governorData;
  return useLockerData(lockerKey);
};

export const useEscrow = (owner?: PublicKey) => {
  const { tribecaMut } = useSDK();
  const { network, wallet } = useSolana();
  const { governorData, governor, veToken, govToken } = useGovernor();
  const lockerKey = governorData
    ? governorData.account.electorate
    : governorData;

  const { data: escrowKey } = useQuery(
    ['escrowKey', network, lockerKey?.toString(), owner?.toString()],
    async () => {
      invariant(lockerKey && owner);
      const [escrowKey] = await findEscrowAddress(lockerKey, owner);
      return escrowKey;
    },
    {
      enabled: !!(lockerKey && owner)
    }
  );

  const { data: escrow, isLoading: isEscrowLoading } = useEscrowData(escrowKey);
  const canLoadEscrow =
    !!governorData && !!(lockerKey && owner && tribecaMut && escrow);

  const result = useQuery(
    ['escrow', escrow?.publicKey.toString()],
    async () => {
      invariant(lockerKey && owner && tribecaMut && escrow);
      const escrowW = new VoteEscrow(
        tribecaMut,
        lockerKey,
        governor!,
        escrow.publicKey,
        owner
      );
      return {
        escrow: escrow.account,
        escrowW,
        calculateVotingPower: await escrowW.makeCalculateVotingPower()
      };
    },
    {
      enabled: canLoadEscrow
    }
  );

  const { refetch } = result;
  useEffect(() => {
    if (canLoadEscrow) {
      void refetch();
    }
  }, [canLoadEscrow, escrow, refetch]);

  const veBalance =
    veToken && result.data
      ? new TokenAmount(
          veToken,
          result.data.calculateVotingPower(new Date().getTime() / 1_000)
        )
      : null;

  const govTokensLocked =
    wallet && govToken
      ? new TokenAmount(govToken, result.data ? result.data.escrow.amount : 0)
      : null;

  return {
    ...result,
    isEscrowLoading,
    veBalance,
    govTokensLocked,
    escrow: escrow === null ? null : result.data,
    escrowKey
  };
};

export const useUserEscrow = () => {
  const { tribecaMut } = useSDK();
  return useEscrow(tribecaMut?.provider.wallet.publicKey);
};
