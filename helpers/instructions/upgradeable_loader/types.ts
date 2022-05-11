import { u64 } from '@saberhq/token-utils';
import { PublicKey } from '@solana/web3.js';
import type { Infer } from 'superstruct';
import {
  any,
  coerce,
  create,
  literal,
  nullable,
  number,
  type,
  union
} from 'superstruct';

import { PublicKeyFromString } from '../../validators/pubkey';
import { ParsedInfo } from '../parseNonAnchorInstruction';

export type ProgramAccountInfo = Infer<typeof ProgramAccountInfo>;
export const ProgramAccountInfo = type({
  programData: PublicKeyFromString
});

export type ProgramAccount = Infer<typeof ProgramDataAccount>;
export const ProgramAccount = type({
  type: literal('program'),
  info: ProgramAccountInfo
});

export type ProgramDataAccountInfo = Infer<typeof ProgramDataAccountInfo>;
export const ProgramDataAccountInfo = type({
  authority: nullable(PublicKeyFromString),
  // don't care about data yet
  slot: number()
});

export type ProgramDataAccount = Infer<typeof ProgramDataAccount>;
export const ProgramDataAccount = type({
  type: literal('programData'),
  info: ProgramDataAccountInfo
});

export type ProgramBufferAccountInfo = Infer<typeof ProgramBufferAccountInfo>;
export const ProgramBufferAccountInfo = type({
  authority: nullable(PublicKeyFromString)
  // don't care about data yet
});

export type ProgramBufferAccount = Infer<typeof ProgramBufferAccount>;
export const ProgramBufferAccount = type({
  type: literal('buffer'),
  info: ProgramBufferAccountInfo
});

export type ProgramUninitializedAccountInfo = Infer<
  typeof ProgramUninitializedAccountInfo
>;
export const ProgramUninitializedAccountInfo = any();

export type ProgramUninitializedAccount = Infer<
  typeof ProgramUninitializedAccount
>;
export const ProgramUninitializedAccount = type({
  type: literal('uninitialized'),
  info: ProgramUninitializedAccountInfo
});

const ACCOUNT_TYPE_SIZE = 4;
const SLOT_SIZE = 8; // size_of::<u64>();
const OPTION_SIZE = 1;
const PUBKEY_LEN = 32;

export type BPFUpgradeableLoaderAccount =
  | {
      type: 'uninitialized';
    }
  | {
      type: 'buffer';
      authority: PublicKey;
      data: Uint8Array;
    }
  | {
      type: 'program';
      programData: PublicKey;
    }
  | {
      type: 'programData';
      slot: u64;
      upgradeAuthority: PublicKey;
      data: Uint8Array;
    }
  | {
      type: 'error';
    };

/**
 * raw: https://github.com/solana-labs/solana/blob/master/sdk/program/src/bpf_loader_upgradeable.rs
 */
export const decodeBPFUpgradeableLoaderAccount = (
  data: Uint8Array
): BPFUpgradeableLoaderAccount => {
  const type = data.slice(0, ACCOUNT_TYPE_SIZE);
  const rest = data.slice(ACCOUNT_TYPE_SIZE);
  switch (type[0]) {
    case 0: {
      return {
        type: 'uninitialized'
      };
    }
    case 1: {
      return {
        type: 'buffer',
        authority: new PublicKey(
          Buffer.from(rest.slice(OPTION_SIZE, OPTION_SIZE + PUBKEY_LEN))
        ),
        data: rest.slice(OPTION_SIZE + PUBKEY_LEN)
      };
    }
    case 2: {
      return {
        type: 'program',
        programData: new PublicKey(rest.slice(0, PUBKEY_LEN))
      };
    }
    case 3: {
      return {
        type: 'programData',
        slot: u64.fromBuffer(Buffer.from(rest.slice(0, SLOT_SIZE))),
        upgradeAuthority: new PublicKey(
          rest.slice(
            SLOT_SIZE + OPTION_SIZE,
            SLOT_SIZE + OPTION_SIZE + PUBKEY_LEN
          )
        ),
        data: rest.slice(SLOT_SIZE + PUBKEY_LEN)
      };
    }
    default: {
      return {
        type: 'error'
      };
    }
  }
};

export type UpgradeableLoaderAccount = Infer<typeof UpgradeableLoaderAccount>;
export const UpgradeableLoaderAccount = coerce(
  union([
    ProgramAccount,
    ProgramDataAccount,
    ProgramBufferAccount,
    ProgramUninitializedAccount
  ]),
  ParsedInfo,
  value => {
    // Coercions like `PublicKeyFromString` are not applied within
    // union validators so we use this custom coercion as a workaround.
    switch (value.type) {
      case 'program': {
        return {
          type: value.type,
          info: create(value.info, ProgramAccountInfo)
        };
      }
      case 'programData': {
        return {
          type: value.type,
          info: create(value.info, ProgramDataAccountInfo)
        };
      }
      case 'buffer': {
        return {
          type: value.type,
          info: create(value.info, ProgramBufferAccountInfo)
        };
      }
      case 'uninitialized': {
        return {
          type: value.type,
          info: create(value.info, ProgramUninitializedAccountInfo)
        };
      }
      default: {
        throw new Error(`Unknown program account type: ${value.type}`);
      }
    }
  }
);
