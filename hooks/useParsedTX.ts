import { SuperCoder } from '@saberhq/anchor-contrib';
import { useSolana } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import { startCase } from 'lodash';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { parseNonAnchorInstruction } from 'helpers/instructions/parseNonAnchorInstruction';
import { useGokiTransactionData } from 'helpers/parser';
import { displayAddress, programLabel } from 'helpers/utils';
import { useIDLs } from './useIDLs';
import type { ParsedInstruction } from './useSmartWallet';
import { useTXAddress } from './useTXAddress';

export const useParsedTX = (smartWalletKey: PublicKey, index: number) => {
  const { data: key } = useTXAddress(smartWalletKey, index);
  return useParsedTXByKey(key);
};

export const useParsedTXByKey = (key: PublicKey | undefined) => {
  const { network } = useSolana();
  const { data: txData, isLoading: loading } = useGokiTransactionData(key);
  const idls = useIDLs(
    txData?.account.instructions.map(ix => ix.programId) ?? []
  );

  const query = useQuery(
    ['parsedTX', network, key],
    () => {
      invariant(txData);
      const instructions: ParsedInstruction[] = txData.account.instructions
        .map(rawIx => ({
          ...rawIx,
          data: Buffer.from(rawIx.data)
        }))
        .map((ix): Omit<ParsedInstruction, 'title'> => {
          const idl = idls.find(theIDL =>
            theIDL.data?.programID.equals(ix.programId)
          )?.data?.idl;
          const label = programLabel(ix.programId.toString());
          if (idl) {
            const superCoder = new SuperCoder(ix.programId, {
              ...idl,
              instructions: idl.instructions.concat(idl.state?.methods ?? [])
            });
            return {
              programName: label ?? startCase(idl.name),
              ix,
              parsed: { ...superCoder.parseInstruction(ix), anchor: true }
            };
          }
          const parsedNonAnchor = parseNonAnchorInstruction(ix);
          return { ix, programName: label, parsed: parsedNonAnchor };
        })
        .map(
          (ix): ParsedInstruction => ({
            ...ix,
            title: `${
              ix.programName ?? displayAddress(ix.ix.programId.toString())
            }: ${startCase(
              (ix.parsed && 'name' in ix.parsed ? ix.parsed.name : null) ??
                'Unknown Instruction'
            )}`
          })
        );
      return {
        tx: txData,
        index: txData.account.index.toNumber(),
        instructions
      };
    },
    {
      enabled: !!txData
    }
  );

  useEffect(() => {
    if (txData && !query.isFetching) {
      void query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txData]);
  return { ...query, isLoading: query.isLoading || loading };
};
