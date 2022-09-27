import type { Idl } from '@project-serum/anchor';
import type { AnchorError } from '@saberhq/anchor-contrib';
import type { TransactionEnvelope } from '@saberhq/solana-contrib';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';
import type { PublicKey, TransactionInstruction } from '@solana/web3.js';

import type { ProgramKey } from 'helpers/sdk';

export class IdlError extends Error {}

export type KnownProgram = ProgramKey | 'Token' | 'AToken' | 'StableSwap';

export type ProgramErrorRepr = AnchorError<Idl> & {
  displayMessage: string;
};

export function parseIdlErrors(idl: Idl): Map<number, ProgramErrorRepr> {
  const errors = new Map<number, ProgramErrorRepr>();
  if (idl.errors) {
    idl.errors.forEach(e => {
      const msg = e.msg ?? e.name;
      errors.set(e.code, { ...e, displayMessage: msg });
    });
  }
  return errors;
}

// An error from a user defined program.
export class ProgramError extends Error {
  constructor(
    readonly errorInfo: ProgramErrorRepr,
    readonly underlying: string,
    readonly program?: KnownProgram
  ) {
    super(errorInfo.displayMessage);
    this.name = `${program ?? 'Anchor'}ProgramError`;
  }

  static parse(
    err: Error,
    txEnv: TransactionEnvelope,
    programIDs: Record<string, ProgramKey>,
    programErrors: { [K in ProgramKey]?: Map<number, ProgramErrorRepr> },
    programNameOverride?: ProgramKey
  ): ProgramError | null {
    // TODO: don't rely on the error string. web3.js should preserve the error
    //       code information instead of giving us an untyped string.
    const components = err.toString().split(': custom program error: ');
    if (components.length !== 2) {
      return null;
    }

    let errorCode: number;
    try {
      if (!components[1]) {
        return null;
      }
      errorCode = parseInt(components[1]);
    } catch (parseErr) {
      return null;
    }

    // Parse user error.
    const parts = components[0]?.split(' ');
    const instructionIdxStr = parts?.[parts.length - 1];
    let instruction: TransactionInstruction;
    try {
      if (!instructionIdxStr) {
        return null;
      }
      const inst = txEnv.instructions[parseInt(instructionIdxStr)];
      if (!inst) {
        return null;
      }
      instruction = inst;
    } catch (e) {
      return null;
    }

    const errantProgramId = instruction.programId;
    const programName =
      programNameOverride ??
      (errantProgramId ? programIDs[errantProgramId.toString()] : null);
    const idlErrors = programName ? programErrors[programName] : null;
    if (programName) {
      const errorInfo = idlErrors?.get(errorCode);
      if (errorInfo !== undefined) {
        return new ProgramError(errorInfo, err.toString(), programName);
      }
    }

    return parseError(errantProgramId, errorCode, err);
  }

  get code(): number {
    return this.errorInfo.code;
  }

  get errorName(): string {
    return this.errorInfo.name;
  }

  override toString(): string {
    return this.errorInfo.displayMessage;
  }
}

const LangErrorCode = {
  // Instructions.
  InstructionMissing: 100,
  InstructionFallbackNotFound: 101,
  InstructionDidNotDeserialize: 102,
  InstructionDidNotSerialize: 103,

  // IDL instructions.
  IdlInstructionStub: 120,
  IdlInstructionInvalidProgram: 121,

  // Constraints.
  ConstraintMut: 140,
  ConstraintBelongsTo: 141,
  ConstraintSigner: 142,
  ConstraintRaw: 143,
  ConstraintOwner: 144,
  ConstraintRentExempt: 145,
  ConstraintSeeds: 146,
  ConstraintExecutable: 147,
  ConstraintState: 148,
  ConstraintAssociated: 149,
  ConstraintAssociatedInit: 150,
  ConstraintClose: 151,

  // Accounts.
  AccountDiscriminatorAlreadySet: 160,
  AccountDiscriminatorNotFound: 161,
  AccountDiscriminatorMismatch: 162,
  AccountDidNotDeserialize: 163,
  AccountDidNotSerialize: 164,
  AccountNotEnoughKeys: 165,
  AccountNotMutable: 166,
  AccountNotProgramOwned: 167,

  // State.
  StateInvalidAddress: 180,

  // Used for APIs that shouldn't be used anymore.
  Deprecated: 299
};

const codesToName: Record<number, string> = Object.entries(
  LangErrorCode
).reduce(
  (acc, el) => ({
    ...acc,
    [el[1]]: el[0]
  }),
  {}
);

const LangErrorMessage = new Map([
  // Instructions.
  [
    LangErrorCode.InstructionMissing,
    '8 byte instruction identifier not provided'
  ],
  [
    LangErrorCode.InstructionFallbackNotFound,
    'Fallback functions are not supported'
  ],
  [
    LangErrorCode.InstructionDidNotDeserialize,
    'The program could not deserialize the given instruction'
  ],
  [
    LangErrorCode.InstructionDidNotSerialize,
    'The program could not serialize the given instruction'
  ],

  // Idl instructions.
  [
    LangErrorCode.IdlInstructionStub,
    'The program was compiled without idl instructions'
  ],
  [
    LangErrorCode.IdlInstructionInvalidProgram,
    'The transaction was given an invalid program for the IDL instruction'
  ],

  // Constraints.
  [LangErrorCode.ConstraintMut, 'A mut constraint was violated'],
  [LangErrorCode.ConstraintBelongsTo, 'A belongs_to constraint was violated'],
  [LangErrorCode.ConstraintSigner, 'A signer constraint was violated'],
  [LangErrorCode.ConstraintRaw, 'A raw constraint as violated'],
  [LangErrorCode.ConstraintOwner, 'An owner constraint was violated'],
  [LangErrorCode.ConstraintRentExempt, 'A rent exempt constraint was violated'],
  [LangErrorCode.ConstraintSeeds, 'A seeds constraint was violated'],
  [LangErrorCode.ConstraintExecutable, 'An executable constraint was violated'],
  [LangErrorCode.ConstraintState, 'A state constraint was violated'],
  [LangErrorCode.ConstraintAssociated, 'An associated constraint was violated'],
  [
    LangErrorCode.ConstraintAssociatedInit,
    'An associated init constraint was violated'
  ],
  [LangErrorCode.ConstraintClose, 'A close constraint was violated'],

  // Accounts.
  [
    LangErrorCode.AccountDiscriminatorAlreadySet,
    'The account discriminator was already set on this account'
  ],
  [
    LangErrorCode.AccountDiscriminatorNotFound,
    'No 8 byte discriminator was found on the account'
  ],
  [
    LangErrorCode.AccountDiscriminatorMismatch,
    '8 byte discriminator did not match what was expected'
  ],
  [LangErrorCode.AccountDidNotDeserialize, 'Failed to deserialize the account'],
  [LangErrorCode.AccountDidNotSerialize, 'Failed to serialize the account'],
  [
    LangErrorCode.AccountNotEnoughKeys,
    'Not enough account keys given to the instruction'
  ],
  [LangErrorCode.AccountNotMutable, 'The given account is not mutable'],
  [
    LangErrorCode.AccountNotProgramOwned,
    'The given account is not owned by the executing program'
  ],

  // State.
  [
    LangErrorCode.StateInvalidAddress,
    'The given state account does not have the correct address'
  ],

  // Misc.
  [
    LangErrorCode.Deprecated,
    'The API being used is deprecated and should no longer be used'
  ]
]);

export const handlers: Record<
  string,
  {
    name: KnownProgram;
    displayMessage: (code: number) => string | undefined;
  }
> = {
  [TOKEN_PROGRAM_ID.toString()]: {
    name: 'Token' as const,
    displayMessage: (code: number): string | undefined => {
      switch (code) {
        case 1:
          return 'Insufficient token balance (need more SOL)';
      }
    }
  },
  [ASSOCIATED_TOKEN_PROGRAM_ID.toString()]: {
    name: 'AToken' as const,
    displayMessage: (code: number): string | undefined => {
      switch (code) {
        case 1:
          return 'Insufficient token balance (need more SOL)';
      }
    }
  }
};

/**
 * Parses an error into a ProgramError if possible.
 * @param errantProgramID
 * @param code
 * @param err
 * @returns
 */
export const parseError = (
  errantProgramID: PublicKey,
  code: number,
  err: Error
): ProgramError | null => {
  const handler = handlers[errantProgramID.toString()];
  if (handler) {
    return new ProgramError(
      {
        code,
        displayMessage:
          handler.displayMessage(code) ?? `unknown (code ${code})`,
        name: code.toString()
      },
      err.toString(),
      handler.name
    );
  }

  // Parse framework internal error.
  const message = LangErrorMessage.get(code);
  if (message !== undefined) {
    return new ProgramError(
      {
        code,
        msg: message,
        name: codesToName[code] ?? 'AnchorInternalUnknown',
        displayMessage: message ?? `unknown (code ${code})`
      },
      err.toString()
    );
  }

  // Unable to parse the error. Just return the untranslated error.
  return null;
};
