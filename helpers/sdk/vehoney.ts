import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import {
  Metadata,
  Edition,
  MetadataProgram,
} from "@metaplex-foundation/mpl-token-metadata";


import { ClientBase } from './base';
import { HONEY_MINT } from './constant';
import veHoneyIdl from '../idl/ve_honey.json';
import { VeHoney } from '../types/ve_honey';

export const VE_HONEY_PROGRAM_ID = new PublicKey(
  'CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q'
);
export const ESCROW_SEED = 'Escrow';
export const WHITELIST_ENTRY_SEED = 'LockerWhitelistEntry';
export const NFT_RECEIPT_SEED = "Receipt";
export const PROOF_SEED = "Proof";
export const TREASURY_SEED = "Treasury";



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
      await this.program.methods
        .initEscrow()
        .accounts({
          payer: this.wallet.publicKey,
          locker,
          escrow,
          escrowOwner: this.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .instruction()
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

    let preInstructions: anchor.web3.TransactionInstruction[] = [];
    if (!destination) {
      destination = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        this.wallet.publicKey
      );

      preInstructions.push(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          HONEY_MINT,
          destination,
          this.wallet.publicKey,
          this.wallet.publicKey
        )
      );
    }

    const lockedTokens = await this.getEscrowLockedTokenPDA(escrow);

    const txSig = await this.program.methods
      .unlock()
      .accounts({
        payer: this.wallet.publicKey,
        locker,
        escrow,
        escrowOwner: this.wallet.publicKey,
        lockedTokens,
        destinationTokens: destination,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .preInstructions(preInstructions)
      .rpc();

    return { txSig, destination };
  }

  async lock(
    locker: PublicKey,
    source: PublicKey,
    amount: anchor.BN,
    duration: anchor.BN,
    hasEscrow?: boolean
  ) {
    const preInstructions = [];
    if (!hasEscrow) {
      preInstructions.push(...(await this.createInitializeEscrowIx(locker)));
    }

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

    const txSig = await this.program.methods
      .lock(new anchor.BN(amount), new anchor.BN(duration))
      .accounts({
        locker,
        escrow,
        lockedTokens,
        escrowOwner: this.wallet.publicKey,
        sourceTokens: source,
        sourceTokensAuthority: this.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .remainingAccounts(remainingAccounts)
      .preInstructions(preInstructions)
      .rpc();
    return { txSig, escrow };
  }

  //TODO:  Lock NFT
  //  async LockNft({ duration, nft }: LockNftArgs) {
  //   const creator = new PublicKey(
  //     nft.metadata.data.data.creators.at(0).address
  //   );

  //   const proof = await this.getProofAddress(creator);
  //   const nftMint = nft.mint.address;
  //   const nftMetadata = await Metadata.getPDA(nftMint);
  //   const nftEdition = await Edition.getPDA(nftMint);
  //   const remainingAccounts = [
  //     {
  //       pubkey: proof,
  //       isSigner: false,
  //       isWritable: false
  //     },
  //     {
  //       pubkey: MetadataProgram.PUBKEY,
  //       isSigner: false,
  //       isWritable: false
  //     },
  //     {
  //       pubkey: nftMetadata,
  //       isSigner: false,
  //       isWritable: true
  //     },
  //     {
  //       pubkey: nftMint,
  //       isSigner: false,
  //       isWritable: true
  //     },
  //     {
  //       pubkey: nftEdition,
  //       isSigner: false,
  //       isWritable: true
  //     }
  //   ];

  //   if (nft.metadata.data.collection && nft.metadata.data.collection.verified) {
  //     remainingAccounts.push({
  //       pubkey: new PublicKey(nft.metadata.data.collection.key),
  //       isSigner: false,
  //       isWritable: true
  //     });
  //   }

  //   let lockedTokens = await this.getLockedTokensAddress();
  //   let preInstruction: anchor.web3.TransactionInstruction[] = [];

  //   if (
  //     (await this.tokenMint.tryGetAssociatedTokenAccount(this.escrow)) === null
  //   ) {
  //     preInstruction.push(
  //       Token.createAssociatedTokenAccountInstruction(
  //         ASSOCIATED_TOKEN_PROGRAM_ID,
  //         TOKEN_PROGRAM_ID,
  //         this.tokenMint.address,
  //         lockedTokens,
  //         this.escrow,
  //         this.wallet.publicKey
  //       )
  //     );
  //   }

  //   let wlDestination = await this.getWLTokenAddress();

  //   if (
  //     (await this.wlTokenMint.tryGetAssociatedTokenAccount(
  //       this.wallet.publicKey
  //     )) === null
  //   ) {
  //     preInstruction.push(
  //       Token.createAssociatedTokenAccountInstruction(
  //         ASSOCIATED_TOKEN_PROGRAM_ID,
  //         TOKEN_PROGRAM_ID,
  //         this.wlTokenMint.address,
  //         wlDestination,
  //         this.wallet.publicKey,
  //         this.wallet.publicKey
  //       )
  //     );
  //   }

  //   const escrowAccount = await this.fetchEscrow();
  //   if (!escrowAccount) {
  //     throw new Error('escrow undefined');
  //   }

  //   const txBuilder =  this.program.methods
  //     .lockNft(duration)
  //     .accounts({
  //       payer: this.wallet.publicKey,
  //       locker: this.governor.locker,
  //       escrow: this.escrow,
  //       receipt: await this.getReceiptAddress(escrowAccount.receiptCount),
  //       escrowOwner: this.wallet.publicKey,
  //       lockedTokens: await this.getLockedTokensAddress(),
  //       lockerTreasury: await this.getTreasuryAddress(),
  //       nftSource: await nft.mint.getAssociatedTokenAddress(
  //         this.wallet.publicKey
  //       ),
  //       nftSourceAuthority: this.wallet.publicKey,
  //       wlTokenMint: this.wlTokenMint.address,
  //       wlDestination,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //       tokenProgram: TOKEN_PROGRAM_ID
  //     })
  //     .preInstructions([...preInstruction])
  //     .remainingAccounts([...remainingAccounts])
  //     ;

  //     const txSig = await txBuilder.rpc();

  //     return { txSig }
  // }

  // private async createCloseEscrowTx() {
  //   let destination = await this.tokenMint.getAssociatedTokenAddress(
  //     this.wallet.publicKey
  //   );
  //   let preInstructions: anchor.web3.TransactionInstruction[] = [];

  //   if (
  //     (await this.tokenMint.tryGetAssociatedTokenAccount(
  //       this.wallet.publicKey
  //     )) === null
  //   ) {
  //     preInstructions.push(
  //       Token.createAssociatedTokenAccountInstruction(
  //         ASSOCIATED_TOKEN_PROGRAM_ID,
  //         TOKEN_PROGRAM_ID,
  //         this.tokenMint.address,
  //         destination,
  //         this.wallet.publicKey,
  //         this.wallet.publicKey
  //       )
  //     );
  //   }

  //   return await this.veHoneyProgram.methods
  //     .closeEscrow()
  //     .accounts({
  //       locker: this.governor.locker,
  //       escrow: this.escrow,
  //       escrowOwner: this.wallet.publicKey,
  //       lockedTokens: await this.getLockedTokensAddress(),
  //       fundsReceiver: this.wallet.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     })
  //     .preInstructions([...preInstructions])
  //     .transaction();
  // }


  // private async createCloseReceiptTx(receiptId: anchor.BN, locker: PublicKey) {
  //   const [escrow] = await this.getEscrowPDA(locker);

  //   return await this.program.methods
  //     .closeReceipt()
  //     .accounts({
  //       locker,
  //       escrow: escrow,
  //       nftReceipt: await this.getReceiptAddress(receiptId),
  //       escrowOwner: this.wallet.publicKey,
  //       fundsReceiver: this.wallet.publicKey
  //     })
  //     .transaction();
  // }

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

  async getAllEscrowAccounts() {
    return this.program.account.escrow.all();
  }

  async getAllLockerAccounts() {
    return this.program.account.locker.all();
  }

  // async getReceiptAddress(receiptId: anchor.BN) {
  //   const [address] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(NFT_RECEIPT_SEED),
  //       this.governor.locker.toBuffer(),
  //       this.wallet.publicKey.toBuffer(),
  //       receiptId.toBuffer('le', 8)
  //     ],
  //     this.program.programId
  //   );
  //   return address;
  // }

  //  async getLockedTokensAddress() {
  //   if (this.tokenMint) {
  //     return await this.tokenMint.getAssociatedTokenAddress(this.escrow);
  //   }
  //   return null;
  // }

  //  async getWLTokenAddress() {
  //   if (this.wlTokenMint) {
  //     return await this.wlTokenMint.getAssociatedTokenAddress(
  //       this.wallet.publicKey
  //     );
  //   }
  //   return null;
  // }

  // public async getProofAddress(proofFor: PublicKey) {
  //   const [address] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(PROOF_SEED),
  //       this.locker.toBuffer(),
  //       proofFor.toBuffer(),
  //     ],
  //     this.program.programId
  //   );
  //   return address;
  // }

  // public async getTreasuryAddress() {
  //   const [address] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(TREASURY_SEED),
  //       this.locker.toBuffer(),
  //       this.tokenMint.address.toBuffer(),
  //     ],
  //     this.program.programId
  //   );
  //   return address;
  // }
}
