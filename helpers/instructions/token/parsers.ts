import { structLayout, u64, Uint64Layout } from "@saberhq/token-utils";
import * as BufferLayout from "@solana/buffer-layout";
import type { PublicKey, TransactionInstruction } from "@solana/web3.js";

import type { TokenInstructionType, Transfer, TransferChecked } from "./types";
import { tokenInstructionTypes } from "./types";

export type TokenInstructionData = Transfer | TransferChecked;

type TokenDatas = {
  transfer: Transfer;
  transfer2: TransferChecked;
};

export type TokenInstructionInner =
  | {
      [K in keyof TokenDatas]: {
        type: K;
        data: TokenDatas[K] | null;
      };
    }[keyof TokenDatas]
  | {
      type: {
        [K in TokenInstructionType]: K extends keyof TokenDatas ? never : K;
      }[TokenInstructionType];
      data: null;
    };

export type TokenIxData<K extends TokenInstructionType> =
  K extends keyof TokenDatas ? TokenDatas[K] : null;

export const parseTokenInstructionData = <
  K extends TokenInstructionInner["type"]
>(
  type: K,
  keys: PublicKey[],
  data: Buffer
): (TokenInstructionInner & { type: K })["data"] => {
  switch (type) {
    case "transfer": {
      const dataLayout = BufferLayout.struct<{
        amount: Uint8Array;
      }>([Uint64Layout("amount")]);
      const decoded = dataLayout.decode(data);
      const [source, destination, authority] = keys;
      if (!source || !destination || !authority) {
        return null;
      }
      const amount = u64.fromBuffer(Buffer.from(decoded.amount));
      return {
        source,
        destination,
        amount: amount.toString(),
        authority,
      };
    }
    case "transfer2": {
      const dataLayout = structLayout<{
        amount: Uint8Array;
        decimals: number;
      }>([Uint64Layout("amount"), BufferLayout.u8("decimals")]);
      const decoded = dataLayout.decode(data);
      const [source, mint, destination, authority] = keys;
      if (!source || !destination || !mint) {
        return null;
      }
      const amount = u64.fromBuffer(Buffer.from(decoded.amount));
      return {
        source,
        destination,
        mint,
        tokenAmount: {
          amount: amount.toString(),
          decimals: decoded.decimals,
          uiAmountString: amount.toString(),
        },
        authority,
      };
    }
  }
  return null;
};

const accountLabels: { [K in TokenInstructionType]?: string[] } = {
  transfer: ["Source", "Destination", "Authority"],
  transfer2: ["Source", "Mint", "Destination", "Authority"],
};

export const parseTokenInstruction = (
  ix: TransactionInstruction
): TokenInstructionInner & {
  accountLabels?: string[];
} => {
  const ixLayout = structLayout<{
    instruction: number;
  }>([BufferLayout.u8("instruction")]);
  const { instruction } = ixLayout.decode(ix.data);
  const rest = ix.data.slice(1);
  const ixType = tokenInstructionTypes[instruction];
  if (!ixType) {
    throw new Error("ix type");
  }
  const data = parseTokenInstructionData(
    ixType,
    ix.keys.map((k) => k.pubkey),
    rest
  );
  return {
    type: ixType,
    data,
    accountLabels: accountLabels[ixType],
  } as TokenInstructionInner & {
    accountLabels?: string[];
  };
};
