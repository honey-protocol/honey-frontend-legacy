import type {
  SmartWalletData,
  SmartWalletTransactionData,
  SmartWalletTypes,
  SmartWalletWrapper
} from '@gokiprotocol/client';
import {
  findTransactionAddress,
  GOKI_ADDRESSES,
  SmartWalletJSON
} from '@gokiprotocol/client';
import type { InstructionParsed } from '@saberhq/anchor-contrib';
import { SuperCoder } from '@saberhq/anchor-contrib';
import type { ProgramAccount } from '@saberhq/token-utils';
import type { TransactionInstruction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { startCase, uniq } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { createContainer } from 'unstated-next';

import { useSDK } from 'helpers/sdk';
import type { ParsedNonAnchorInstruction } from 'helpers/instructions/parseNonAnchorInstruction';
import {
  InstructionParseError,
  parseNonAnchorInstruction
} from 'helpers/instructions/parseNonAnchorInstruction';
import {
  useBatchedGokiTransactions,
  useGokiSmartWalletData
} from 'helpers/parser';
import { displayAddress, programLabel } from 'helpers/utils';
import { useIDLs } from './useIDLs';

export const SMART_WALLET_CODER = new SuperCoder<SmartWalletTypes>(
  GOKI_ADDRESSES.SmartWallet,
  SmartWalletJSON
);

export interface ParsedInstruction {
  ix: TransactionInstruction;
  parsed?:
    | ParsedNonAnchorInstruction
    | ({ anchor: true } & InstructionParsed)
    | { error: InstructionParseError }
    | null;
  programName?: string;
  title: string;
}

export interface ParsedTX {
  tx: ProgramAccount<SmartWalletTransactionData>;
  index: number;
  instructions: ParsedInstruction[];
}

const useSmartWalletInner = (
  key?: PublicKey
): {
  key: PublicKey;
  smartWallet: SmartWalletWrapper | null;
  smartWalletData?: ProgramAccount<SmartWalletData> | null;
  parsedTXs?: ParsedTX[];
  threshold?: number;
  path: string;
} => {
  if (!key) {
    throw new Error('missing key');
  }
  const { sdkMut } = useSDK();

  const { data: smartWalletData } = useGokiSmartWalletData(key);
  const [smartWallet, setSmartWallet] = useState<SmartWalletWrapper | null>(
    null
  );

  const [txAddrs, setTxAddrs] = useState<PublicKey[]>([]);
  const { data: txs } = useBatchedGokiTransactions(txAddrs);

  useEffect(() => {
    if (!smartWalletData) {
      setTxAddrs([]);
      return;
    }
    void (async () => {
      const numTransactions =
        smartWalletData.account.numTransactions.toNumber();
      if (numTransactions) {
        const txAddrs = await Promise.all(
          Array(numTransactions)
            .fill(null)
            .map(async (_, i) => {
              const [key] = await findTransactionAddress(
                smartWalletData.publicKey,
                i
              );
              return key;
            })
        );
        setTxAddrs(txAddrs);
      }
    })();
  }, [key, smartWalletData]);

  useEffect(() => {
    if (!sdkMut) {
      setSmartWallet(null);
      return;
    }
    void (async () => {
      const sw = await sdkMut.loadSmartWallet(key);
      setSmartWallet(sw);
    })();
  }, [key, sdkMut]);

  const programIDsToFetch = useMemo(
    () =>
      uniq(
        txs
          ?.flatMap(tx =>
            tx?.account.instructions.map(ix => ix.programId.toString())
          )
          .filter((x): x is string => !!x)
      ),
    [txs]
  );

  const idls = useIDLs(programIDsToFetch.map(p => new PublicKey(p)));

  const parsedTXs = useMemo(() => {
    return txs
      ?.filter((tx): tx is ProgramAccount<SmartWalletTransactionData> => !!tx)
      .map((tx): ParsedTX => {
        const index = tx.account.index.toNumber();
        const instructions: ParsedInstruction[] = tx.account.instructions
          .map(rawIx => ({
            ...rawIx,
            data: Buffer.from(rawIx.data)
          }))
          .map((ix): Omit<ParsedInstruction, 'title'> => {
            const idlIndex = programIDsToFetch.findIndex(
              pid => pid === ix.programId.toString()
            );
            const idl = idls[idlIndex]?.data?.idl;
            const label = programLabel(ix.programId.toString());
            if (idl) {
              const superCoder = new SuperCoder(ix.programId, {
                ...idl,
                instructions: idl.instructions.concat(idl.state?.methods ?? [])
              });

              const common = {
                programName: label ?? startCase(idl.name),
                ix
              };

              try {
                const ixParsed = superCoder.parseInstruction(ix);
                return {
                  ...common,
                  parsed: {
                    ...ixParsed,
                    anchor: true
                  }
                };
              } catch (e) {
                return {
                  ...common,
                  parsed: { error: new InstructionParseError(ix, e) }
                };
              }
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
        return { tx, index, instructions };
      })
      .sort((a, b) => {
        const aIndex = a.index;
        const bIndex = b.index;
        if (aIndex !== undefined && bIndex !== undefined) {
          return aIndex < bIndex ? 1 : -1;
        }
        if (aIndex !== undefined && bIndex === undefined) {
          return -1;
        }
        return 1;
      });
  }, [idls, programIDsToFetch, txs]);

  const threshold = smartWalletData?.account.threshold.toNumber();

  const path = `/wallets/${key.toString()}`;

  return { key, smartWallet, smartWalletData, parsedTXs, threshold, path };
};

export const { useContainer: useSmartWallet, Provider: SmartWalletProvider } =
  createContainer(useSmartWalletInner);
