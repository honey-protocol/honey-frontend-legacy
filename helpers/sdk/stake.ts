import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import { ClientBase } from './base';
import { HONEY_MINT, PHONEY_MINT } from './constant';
import stakeIdl from '../idl/stake.json';
import { Stake } from '../types/stake';
import { VeHoneyClient } from './vehoney';

export const STAKE_PROGRAM_ID = new PublicKey(
  '4V68qajTiVHm3Pm9fQoV8D4tEYBmq3a34R9NV5TymLr7'
);
export const POOL_USER_SEED = 'PoolUser';
export const TOKEN_VAULT_SEED = 'TokenVault';
export const VAULT_AUTHORITY_SEED = 'VaultAuthority';

export class StakeClient extends ClientBase<Stake> {
  constructor(connection: Connection, wallet: anchor.Wallet) {
    super(connection, wallet, stakeIdl, STAKE_PROGRAM_ID);
  }

  async fetchPoolInfo(pool: PublicKey) {
    try {
      return await this.program.account.poolInfo.fetch(pool);
    } catch (e) {
      console.log(e);
    }
  }

  async fetchPoolUser(user: PublicKey) {
    try {
      return await this.program.account.poolUser.fetch(user);
    } catch (e) {
      console.log(e);
    }
  }

  async initializeUser(pool: PublicKey) {
    const [user, userBump] = await this.getUserPDA(pool);

    const txSig = await this.program.rpc.initializeUser({
      accounts: {
        payer: this.wallet.publicKey,
        poolInfo: pool,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    });

    return { user, userBump, txSig };
  }

  async deposit(
    pool: PublicKey,
    user: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    hasUser: boolean
  ) {
    const preInstructions = !hasUser
      ? [
          this.program.instruction.initializeUser({
            accounts: {
              payer: this.wallet.publicKey,
              poolInfo: pool,
              userInfo: user,
              userOwner: this.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId
            }
          })
        ]
      : undefined;

    const txSig = await this.program.rpc.deposit(new anchor.BN(amount), {
      accounts: {
        poolInfo: pool,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        pTokenMint: PHONEY_MINT,
        source,
        userAuthority: this.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      preInstructions
    });

    return { txSig, amount };
  }

  async claim(pool: PublicKey, user?: PublicKey, destination?: PublicKey) {
    if (!user) {
      [user] = await this.getUserPDA(pool);
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

    const [authority] = await this.getPoolAuthorityPDA(pool);

    const txSig = await this.program.rpc.claim({
      accounts: {
        payer: this.wallet.publicKey,
        poolInfo: pool,
        authority,
        tokenMint: HONEY_MINT,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        destination,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      preInstructions
    });

    return { destination, txSig };
  }

  async stake(
    pool: PublicKey,
    locker: PublicKey,
    source: PublicKey,
    veHoneyClient: VeHoneyClient,
    amount: anchor.BN,
    duration: anchor.BN,
    whitelistEnabled?: boolean,
    hasEscrow?: boolean
  ) {
    const preInstructions = !hasEscrow
      ? [...(await veHoneyClient.createInitializeEscrowIx(locker))]
      : undefined;

    const remainingAccounts = whitelistEnabled
      ? [
          {
            pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: (
              await veHoneyClient.getWhitelistEntryPDA(
                locker,
                this.program.programId,
                anchor.web3.SystemProgram.programId
              )
            )[0],
            isSigner: false,
            isWritable: false
          }
        ]
      : undefined;

    const [tokenVault] = await this.getTokenVaultPDA();
    const [authority] = await this.getPoolAuthorityPDA(pool);
    const [escrow] = await veHoneyClient.getEscrowPDA(locker);
    const lockedTokens = await veHoneyClient.getEscrowLockedTokenPDA(escrow);
    const lockerProgram = veHoneyClient.getProgramId();

    const txSig = await this.program.rpc.stake(
      new anchor.BN(amount),
      new anchor.BN(duration),
      {
        accounts: {
          poolInfo: pool,
          tokenMint: HONEY_MINT,
          pTokenMint: PHONEY_MINT,
          pTokenFrom: source,
          userAuthority: this.wallet.publicKey,
          tokenVault,
          authority,
          locker,
          escrow,
          lockedTokens,
          lockerProgram,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        remainingAccounts,
        preInstructions
      }
    );

    return { txSig, escrow };
  }

  async getUserPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(POOL_USER_SEED),
        pool.toBuffer(),
        this.wallet.publicKey.toBuffer()
      ],
      this.program.programId
    );
  }

  async getPoolAuthorityPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()],
      this.program.programId
    );
  }

  async getTokenVaultPDA() {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(TOKEN_VAULT_SEED),
        HONEY_MINT.toBuffer(),
        PHONEY_MINT.toBuffer()
      ],
      this.program.programId
    );
  }

  async getVaultAuthority(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()],
      this.program.programId
    );
  }
}
