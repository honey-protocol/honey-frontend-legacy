import * as BufferLayout from "@solana/buffer-layout";
import type { TransactionInstruction } from "@solana/web3.js";
import { startCase } from "lodash";

const instructions = [
  "initializeBuffer",
  "write",
  "deployWithMaxDataLen",
  "upgrade",
  "setAuthority",
  "close",
] as const;

export type UpgradeableLoaderInstructionType = typeof instructions[number];

export const makeUpgradeableLoaderInstructionData = (
  type: UpgradeableLoaderInstructionType
): Buffer => {
  return Buffer.from([instructions.indexOf(type), 0, 0, 0]);
};

export type UpgradeableLoaderInstructionData = {
  name: string;
  type: UpgradeableLoaderInstructionType;
  accountLabels?: string[];
};

/**
 * See: <https://github.com/solana-labs/solana/blob/master/sdk/program/src/loader_upgradeable_instruction.rs>
 */
const accountLabels: { [K in UpgradeableLoaderInstructionType]?: string[] } = {
  initializeBuffer: ["Buffer", "Buffer Authority"],
  write: ["Buffer", "Buffer Authority"],
  deployWithMaxDataLen: [
    "Payer",
    "Program Data",
    "Program",
    "Buffer",
    "Rent",
    "Clock",
    "Program Authority",
  ],
  upgrade: [
    "Program Data",
    "Program",
    "Buffer",
    "Spill",
    "Rent",
    "Clock",
    "Program Authority",
  ],
  setAuthority: ["Account", "Authority", "Next Authority"],
  close: ["Account", "Spill", "Authority", "Program"],
};

export const parseUpgradeableLoaderInstruction = (
  ix: TransactionInstruction
): UpgradeableLoaderInstructionData => {
  const ixLayout = BufferLayout.struct<{
    instruction: number;
  }>([BufferLayout.u32("instruction")]);
  const { instruction } = ixLayout.decode(ix.data);
  const ixType = instructions[instruction];
  if (!ixType) {
    throw new Error("ix type");
  }
  return {
    type: ixType,
    name: startCase(ixType as string),
    accountLabels: accountLabels[ixType],
  };
};
