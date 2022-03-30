import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import {
  HONEY_MINT,
  PHONEY_MINT,
  BASE_ACCOUNT,
  STAKE_PROGRAM_ID,
  POOL_USER_SEED,
  VAULT_AUTHORITY_SEED,
  TOKEN_VAULT_SEED,
  LOCKER_SEED,
  WHITELIST_ENTRY
} from './constant';
import stakeIdl from '../idl/stake.json';
import veHoneyIdl from '../idl/ve_honey.json';
import { Stake } from '../types/stake';
import { VeHoney } from '../types/ve_honey';
import { ESCROW_SEED } from 'constants/vehoney';
import { VE_HONEY_PROGRAM_ID } from './vehoney';

export class StakeClient {
  private connection: Connection;
  public wallet: anchor.Wallet;
  private provider!: anchor.Provider;
  private program!: anchor.Program<Stake>;
  private veProgram!: anchor.Program<VeHoney>;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.setProvider();
    this.setStakeProgram();
    this.setVeHoneyProgram();
  }

  setProvider() {
    this.provider = new anchor.Provider(
      this.connection,
      this.wallet,
      anchor.Provider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setStakeProgram() {
    this.program = new anchor.Program<Stake>(
      stakeIdl as any,
      STAKE_PROGRAM_ID,
      this.provider
    );
  }

  setVeHoneyProgram() {
    this.veProgram = new anchor.Program<VeHoney>(
      veHoneyIdl as any,
      VE_HONEY_PROGRAM_ID,
      this.provider
    );
  }

  async fetchPoolInfo(pool: PublicKey) {
    try {
      return this.program.account.poolInfo.fetch(pool);
    } catch (e) {
      console.log(e);
    }
  }

  async fetchPoolUser(user: PublicKey) {
    try {
      return this.program.account.poolUser.fetch(user);
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

  async claim(pool: PublicKey, user: PublicKey, destination?: PublicKey) {
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
    user: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN
  ) {
    const userPHoneyToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      PHONEY_MINT,
      this.wallet.publicKey
    );

    const [locker] = await this.getLockerPDA(BASE_ACCOUNT);
    const [escrow] = await this.getEscrowPDA(pool);
    const [tokenVault] = await this.getTokenVaultPDA(pool);
    const [vaultAuthority] = await this.getVaultAuthority(pool);

    const lockedTokens = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      HONEY_MINT,
      escrow,
      true
    );
    const txSig = await this.program.rpc.stake(
      new anchor.BN(amount),
      new anchor.BN(duration),
      {
        accounts: {
          poolInfo: pool,
          tokenMint: HONEY_MINT,
          pTokenMint: PHONEY_MINT,
          pTokenFrom: userPHoneyToken,
          userAuthority: this.wallet.publicKey,
          tokenVault,
          authority: vaultAuthority,
          locker,
          escrow,
          lockedTokens,
          lockerProgram: this.veProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        remainingAccounts: [
          {
            pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: WHITELIST_ENTRY,
            isSigner: false,
            isWritable: false
          }
        ],
        preInstructions: [
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            HONEY_MINT,
            lockedTokens,
            escrow,
            user
          ),
          this.veProgram.instruction.initEscrow({
            accounts: {
              payer: user,
              locker,
              escrow: escrow,
              escrowOwner: user,
              systemProgram: anchor.web3.SystemProgram.programId
            }
          })
        ]
      }
    );
    return { txSig, amount, duration };
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

  async getTokenVaultPDA(pool: PublicKey) {
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
      [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()], //check if right stake pool
      this.program.programId //
    );
  }

  async getLockerPDA(base: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(LOCKER_SEED), base.toBuffer()],
      this.veProgram.programId
    );
  }

  async getEscrowPDA(pool: PublicKey) {
    const [locker] = await this.getLockerPDA(BASE_ACCOUNT);

    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ESCROW_SEED),
        locker.toBuffer(),
        this.wallet.publicKey.toBuffer()
      ],
      this.veProgram.programId
    );
  }
}
