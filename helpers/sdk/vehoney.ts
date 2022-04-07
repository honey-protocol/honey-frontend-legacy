import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import { ClientBase } from './base';
import { HONEY_MINT } from './constant';
import veHoneyIdl from '../idl/ve_honey.json';
import { VeHoney } from '../types/ve_honey';

export const VE_HONEY_PROGRAM_ID = new PublicKey(
  'CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q'
);
export const ESCROW_SEED = 'Escrow';
export const WHITELIST_ENTRY_SEED = 'LockerWhitelistEntry';

export class VeHoneyClient extends ClientBase<VeHoney> {
  constructor(connection: Connection, wallet: anchor.Wallet) {
    super(connection, wallet, veHoneyIdl, VE_HONEY_PROGRAM_ID);
  }

  getProgramId() {
    return this.program.programId;
  }

  async fetchLocker(locker: PublicKey) {
    try {
      return await this.program.account.locker.fetch(locker);
    } catch (e) {
      console.log(e);
    }
  }

  async fetchEscrow(escrow: PublicKey) {
    try {
      return await this.program.account.escrow.fetch(escrow);
    } catch (e) {
      console.log(e);
    }
  }

  async createInitializeEscrowIx(locker: PublicKey) {
    const [escrow] = await this.getEscrowPDA(locker);
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    return [
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        lockedTokens,
        escrow,
        this.wallet.publicKey
      ),
      this.program.instruction.initEscrow({
        accounts: {
          payer: this.wallet.publicKey,
          locker,
          escrow,
          escrowOwner: this.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      })
    ];
  }

  async unlockEscrow(
    locker: PublicKey,
    escrow?: PublicKey,
    destination?: PublicKey
  ) {
    if (!escrow) {
      [escrow] = await this.getEscrowPDA(locker);
    }

    let preInstructions: anchor.web3.TransactionInstruction[] | undefined =
      undefined;
    if (!destination) {
      destination = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        this.wallet.publicKey
      );

      preInstructions = [
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          HONEY_MINT,
          destination,
          this.wallet.publicKey,
          this.wallet.publicKey
        )
      ];
    }

    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const txSig = await this.program.rpc.exit({
      accounts: {
        payer: this.wallet.publicKey,
        locker,
        escrow,
        escrowOwner: this.wallet.publicKey,
        lockedTokens,
        destinationTokens: destination,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      preInstructions
    });

    return { txSig, destination };
  }

  async lock(
    locker: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN,
    hasEscrow?: boolean
  ) {
    const preInstructions = !hasEscrow
      ? [...(await this.createInitializeEscrowIx(locker))]
      : undefined;

    const remainingAccounts = [
      {
        pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        isSigner: false,
        isWritable: false
      },
      {
        pubkey: this.program.programId,
        isSigner: false,
        isWritable: false
      }
    ];

    const [escrow] = await this.getEscrowPDA(locker);
    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const txSig = await this.program.rpc.lock(
      new anchor.BN(amount),
      new anchor.BN(duration),
      {
        accounts: {
          locker,
          escrow,
          lockedTokens,
          escrowOwner: this.wallet.publicKey,
          sourceTokens: source,
          sourceTokensAuthority: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        remainingAccounts,
        preInstructions
      }
    );

    return { txSig, escrow };
  }
  async getEscrowPDA(locker: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ESCROW_SEED),
        locker.toBuffer(),
        this.wallet.publicKey.toBuffer()
      ],
      this.program.programId
    );
  }

  async getEscrowLockedTokenPDA(escrow: PublicKey) {
    return Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      HONEY_MINT,
      escrow,
      true
    );
  }

  async getWhitelistEntryPDA(
    locker: PublicKey,
    executableId: PublicKey,
    whitelistedOwner: PublicKey
  ) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(WHITELIST_ENTRY_SEED),
        locker.toBuffer(),
        executableId.toBuffer(),
        whitelistedOwner.toBuffer()
      ],
      this.program.programId
    );
  }
}
