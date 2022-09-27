import { extractErrorMessage } from "@saberhq/sail";
import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import type {
  CreateAccountParams,
  SystemInstructionType,
  TransactionInstruction,
  TransferParams,
  WithdrawNonceParams,
} from "@solana/web3.js";
import { SystemInstruction, SystemProgram } from "@solana/web3.js";
import { startCase } from "lodash";
import type { Infer } from "superstruct";
import { any, string, type } from "superstruct";

import { MEMO_PROGRAM_ID } from "../constants";
import type { TokenInstructionInner } from "./token/parsers";
import { parseTokenInstruction } from "./token/parsers";
import type { TokenInstructionType } from "./token/types";
import { IX_TITLES } from "./token/types";
import { BPF_UPGRADEABLE_LOADER_ID } from "./upgradeable_loader/instructions";
import type { UpgradeableLoaderInstructionType } from "./upgradeable_loader/parsers";
import { parseUpgradeableLoaderInstruction } from "./upgradeable_loader/parsers";

export type MemoInstruction = {
  program: "memo";
  text: string;
};

export type TokenInstruction<
  K extends TokenInstructionType = TokenInstructionType
> = TokenInstructionInner & {
  program: "token";
  type: K;
};

export type UpgradeableLoaderInstruction = {
  program: "upgradeable_loader";
  type: UpgradeableLoaderInstructionType;
};

export type SystemProgramInstruction = {
  program: "system";
  type: SystemInstructionType;
  decoded: TransferParams | CreateAccountParams | WithdrawNonceParams | null;
};

type ParsedNonAnchorInstructionInner =
  | MemoInstruction
  | TokenInstruction
  | UpgradeableLoaderInstruction
  | SystemProgramInstruction;

export type ParsedNonAnchorInstruction<
  T extends ParsedNonAnchorInstructionInner = ParsedNonAnchorInstructionInner
> = T & {
  name: string;
  accountLabels?: string[];
};

type IXParser = (ix: TransactionInstruction) => ParsedNonAnchorInstruction;

export type ParsedInfo = Infer<typeof ParsedInfo>;
export const ParsedInfo = type({
  type: string(),
  info: any(),
});

export const PARSERS: Record<string, IXParser> = {
  [MEMO_PROGRAM_ID.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<MemoInstruction> => {
    const text = ix.data.toString("utf-8");
    return { text, name: "Memo", program: "memo" };
  },
  [TOKEN_PROGRAM_ID.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<TokenInstruction> => {
    const result = parseTokenInstruction(ix);
    const name = IX_TITLES[result.type];
    return { ...result, name, program: "token" };
  },
  [BPF_UPGRADEABLE_LOADER_ID.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<UpgradeableLoaderInstruction> => {
    const result = parseUpgradeableLoaderInstruction(ix);
    return { ...result, program: "upgradeable_loader" };
  },
  [SystemProgram.programId.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<SystemProgramInstruction> => {
    const ixType = SystemInstruction.decodeInstructionType(ix);
    const decoded = (() => {
      switch (ixType) {
        case "Transfer":
          return SystemInstruction.decodeTransfer(ix);
        case "TransferWithSeed":
          return SystemInstruction.decodeTransferWithSeed(ix);
        case "Create":
          return SystemInstruction.decodeCreateAccount(ix);
        case "WithdrawNonceAccount":
          return SystemInstruction.decodeNonceWithdraw(ix);
        default:
          return null;
      }
    })();
    return {
      type: ixType,
      decoded,
      name: startCase(ixType),
      program: "system",
    };
  },
};

export class InstructionParseError extends Error {
  constructor(
    readonly ix: TransactionInstruction,
    readonly originalError: unknown
  ) {
    super(extractErrorMessage(originalError) ?? "unknown");
    this.name = "InstructionParseError";
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

export const parseNonAnchorInstruction = (
  ix: TransactionInstruction
):
  | ParsedNonAnchorInstruction
  | {
      error: InstructionParseError;
    }
  | null => {
  const parser = PARSERS[ix.programId.toString()];
  if (!parser) {
    return null;
  }
  try {
    return parser(ix);
  } catch (e) {
    return { error: new InstructionParseError(ix, e) };
  }
};
