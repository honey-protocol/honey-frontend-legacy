const assert = require("assert");
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { VeHoney } from "../types/ve_honey";
import { Stake } from "../types/stake";
import * as constants from "../../constants/vehoney";
// import kp from './keypair.json'


// const idl = JSON.parse(fs.readFileSync("./target/idl/ve_honey.json", "utf8"));
// const programId = new anchor.web3.PublicKey(
//   "CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q"
// );
const clusterUrl = "https://api.devnet.solana.com";
// const clusterUrl = "http://127.0.0.1:8899";

// read this from local file 
const payer = anchor.web3.Keypair.generate();  
const connection = new anchor.web3.Connection(clusterUrl, "processed");
const provider = new anchor.Provider(connection, new anchor.Wallet(payer), {
  skipPreflight: false,
  preflightCommitment: "processed",
  commitment: "processed",
});
anchor.setProvider(provider);
const program = anchor.workspace.VeHoney as Program<VeHoney>;
// const program = new Program(idl, programID, provider)

const publicConnection = new anchor.web3.Connection(clusterUrl, {
  commitment: "processed",
});

const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;
const LAMPORTS_PER_SOL = anchor.web3.LAMPORTS_PER_SOL;

const admin = anchor.web3.Keypair.generate(); //
const user = anchor.web3.Keypair.generate();
let honeyMint: Token;
let pHoneyMint: Token;
const honeyMintAuthority = anchor.web3.Keypair.generate(); // import
const pHoneyMintAuthority = anchor.web3.Keypair.generate(); // import from file 
const base = anchor.web3.Keypair.generate(); // import from file
let userPHoneyToken: anchor.web3.PublicKey,
  userHoneyToken: anchor.web3.PublicKey,
  locker: anchor.web3.PublicKey,
  escrow: anchor.web3.PublicKey,
  lockedTokens: anchor.web3.PublicKey,
  whitelistEntry: anchor.web3.PublicKey;
const lockerParams = {
  whitelistEnabled: true,
  minStakeDuration: new anchor.BN(1),
  maxStakeDuration: new anchor.BN(5),
  multiplier: 48,
};
const stakeProgram = anchor.workspace.Stake as Program<Stake>;
let tokenVault: anchor.web3.PublicKey,
  tokenVaultBump: number,
  vaultAuthority: anchor.web3.PublicKey,
  vaultAuthorityBump: number;


 export const initiliazeTest =  async () => {
    console.log("Airdrop 1 SOL to payer ...");
    await publicConnection.confirmTransaction(
      await publicConnection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL),
      "finalized"
    );

    console.log("Airdrop 1 SOL to user ...");
    await publicConnection.confirmTransaction(
      await publicConnection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL),
      "finalized"
    );

    honeyMint = await Token.createMint(
      publicConnection,
      payer,
      honeyMintAuthority.publicKey,
      null,
      6,
      TOKEN_PROGRAM_ID
    );

    pHoneyMint = await Token.createMint(
      publicConnection,
      payer,
      pHoneyMintAuthority.publicKey,
      null,
      6,
      TOKEN_PROGRAM_ID
    );

    userPHoneyToken = await pHoneyMint.createAssociatedTokenAccount(
      user.publicKey
    );
    await pHoneyMint.mintTo(userPHoneyToken, pHoneyMintAuthority, [], 5000000);
  };
  

  //   Initialize Locker
 const initializeLocker = async () => {
    const lt = program.addEventListener("InitLockerEvent", (e, s) => {
      console.log("Initialize Locker in Slot: ", s);
      console.log("Locker: ", e.locker.toString());
      console.log("Locker admin: ", e.admin.toString());
      console.log("Token mint: ", e.tokenMint.toString());
      console.log("Min stake duration: ", e.params.minStakeDuration.toString());
      console.log("Max stake duration: ", e.params.maxStakeDuration.toString());
      console.log("Multiplier: ", e.params.multiplier);
      console.log(
        "Whitelist: ",
        e.params.whitelistEnabled ? "Enabled" : "Disabled"
      );
    });

    let lockerBump: number;
    [locker, lockerBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(constants.LOCKER_SEED), base.publicKey.toBuffer()],
      program.programId
    );

    await program.rpc
      .initLocker(admin.publicKey, lockerParams, {
        accounts: {
          payer: payer.publicKey,
          base: base.publicKey,
          locker,
          tokenMint: honeyMint.publicKey,
          systemProgram: SYSTEM_PROGRAM,
        },
        signers: [payer, base],
      })
      .finally(() => {
        setTimeout(() => {
          program.removeEventListener(lt);
        }, 2000);
      });

    const lockerAccount = await program.account.locker.fetch(locker);

    assert.ok(lockerAccount.bump === lockerBump);
    assert.ok(lockerAccount.base.equals(base.publicKey));
    assert.ok(lockerAccount.tokenMint.equals(honeyMint.publicKey));
    assert.ok(lockerAccount.lockedSupply.eq(new anchor.BN(0)));
    assert.ok(
      lockerAccount.params.maxStakeDuration.eq(lockerParams.maxStakeDuration)
    );
    assert.ok(
      lockerAccount.params.minStakeDuration.eq(lockerParams.minStakeDuration)
    );
    assert.ok(lockerAccount.params.multiplier === lockerParams.multiplier);
    assert.ok(
      lockerAccount.params.whitelistEnabled === lockerParams.whitelistEnabled
    );
    assert.ok(lockerAccount.admin.equals(admin.publicKey));
  };
//   Approve program lock privilegeR
const approveProgramLockPrivilege = async () => {
    const lt = program.addEventListener("ApproveLockPrivilegeEvent", (e, s) => {
      console.log("Approve Program Lock in Slot: ", s);
      console.log("Locker: ", e.locker.toString());
      console.log("ProgramId: ", e.programId.toString());
      console.log("Owner of the Escrow: ", e.owner.toString());
      console.log("Timestamp: ", e.timestamp.toString());
    });

    let whitelistEntryBump: number;
    [whitelistEntry, whitelistEntryBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.WHITELIST_ENTRY_SEED),
          locker.toBuffer(),
          stakeProgram.programId.toBuffer(),
          SYSTEM_PROGRAM.toBuffer(),
        ],
        program.programId
      );

    await program.rpc
      .approveProgramLockPrivilege({
        accounts: {
          payer: payer.publicKey,
          locker,
          lockerAdmin: admin.publicKey,
          whitelistEntry,
          executableId: stakeProgram.programId,
          whitelistedOwner: SYSTEM_PROGRAM,
          systemProgram: SYSTEM_PROGRAM,
        },
        signers: [payer, admin],
      })
      .finally(() => {
        setTimeout(() => {
          program.removeEventListener(lt);
        }, 2000);
      });
    
// Initialize stake program 
  const initializeStakeProgram = async () => {
    [tokenVault, tokenVaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.TOKEN_VAULT_SEED),
          honeyMint.publicKey.toBuffer(),
          pHoneyMint.publicKey.toBuffer(),
        ],
        stakeProgram.programId
      );

    [vaultAuthority, vaultAuthorityBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.VAULT_AUTHORITY_SEED),
          honeyMint.publicKey.toBuffer(),
        ],
        stakeProgram.programId
      );

    await stakeProgram.rpc.initialize({
      accounts: {
        payer: payer.publicKey,
        tokenMint: honeyMint.publicKey,
        pTokenMint: pHoneyMint.publicKey,
        tokenVault,
        authority: vaultAuthority,
        systemProgram: SYSTEM_PROGRAM,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    });

    const tokenVaultAccount = await honeyMint.getAccountInfo(tokenVault);

    assert.ok(tokenVaultAccount.mint.equals(honeyMint.publicKey));
    assert.ok(tokenVaultAccount.owner.equals(vaultAuthority));
  };

  // Set mint authority of Honey token to PDA
const setMintAuthority = async () => {
    await stakeProgram.rpc.setMintAuthority(vaultAuthorityBump, {
      accounts: {
        tokenMint: honeyMint.publicKey,
        pTokenMint: pHoneyMint.publicKey,
        tokenVault,
        authority: vaultAuthority,
        originAuthority: honeyMintAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [honeyMintAuthority],
    });

  };

  const stakeAmount = 3000000;
  const duration = 6;
  // Stake pHoney tokens to lock Honey and get Escrow ...
const stakePHONEY = async (stakeAmount: number, duration: number) => {
    const lt1 = program.addEventListener("LockEvent", (e, s) => {
      console.log("Lock in Slot: ", s);
      console.log("Locker: ", e.locker.toString());
      console.log("Escrow Owner: ", e.escrowOwner.toString());
      console.log("Token mint: ", e.tokenMint.toString());
      console.log("Lock amount: ", e.amount.toString());
      console.log("Locked supply: ", e.amount.toString());
      console.log("Lock duration: ", e.duration.toString());
      console.log("Prev lock ends at: ", e.prevEscrowEndsAt.toString());
      console.log("Next escrow ends at: ", e.nextEscrowEndsAt.toString());
      console.log("Next escrow started at: ", e.nextEscrowStartedAt.toString());
    });

    const lt2 = program.addEventListener("InitEscrowEvent", (e, s) => {
      console.log("Initialize Escrow in Slot: ", s);
      console.log("Escrow: ", e.escrow.toString());
      console.log("Locker: ", e.locker.toString());
      console.log("Escrow Owner: ", e.escrow_owner.toString());
      console.log("Timestamp: ", e.timestamp.toString());
    });

    let escrowBump: number;
    [escrow, escrowBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(constants.ESCROW_SEED),
        locker.toBuffer(),
        user.publicKey.toBuffer(),
      ],
      program.programId
    );

    lockedTokens = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      honeyMint.publicKey,
      escrow,
      true
    );

    await stakeProgram.rpc
      .stake(
        vaultAuthorityBump,
        new anchor.BN(stakeAmount),
        new anchor.BN(duration),
        {
          accounts: {
            tokenMint: honeyMint.publicKey,
            pTokenMint: pHoneyMint.publicKey,
            pTokenFrom: userPHoneyToken,
            userAuthority: user.publicKey,
            tokenVault,
            authority: vaultAuthority,
            locker,
            escrow,
            lockedTokens,
            lockerProgram: program.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          remainingAccounts: [
            {
              pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: whitelistEntry,
              isSigner: false,
              isWritable: false,
            },
          ],
          preInstructions: [
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              honeyMint.publicKey,
              lockedTokens,
              escrow,
              user.publicKey
            ),
            program.instruction.initEscrow({
              accounts: {
                payer: user.publicKey,
                locker,
                escrow: escrow,
                escrowOwner: user.publicKey,
                systemProgram: SYSTEM_PROGRAM,
              },
              signers: [user],
            }),
          ],
          signers: [user],
        }
      )
      .finally(() => {
        setTimeout(() => {
          program.removeEventListener(lt1);
          program.removeEventListener(lt2);
        }, 2000);
      });

    const escrowAccount = await program.account.escrow.fetch(escrow);

    assert.ok(escrowAccount.bump === escrowBump);
    assert.ok(escrowAccount.locker.equals(locker));
    assert.ok(escrowAccount.owner.equals(user.publicKey));
    assert.ok(escrowAccount.amount.eq(new anchor.BN(stakeAmount)));
    assert.ok(
      escrowAccount.escrowStartedAt
        .add(new anchor.BN(duration))
        .eq(escrowAccount.escrowEndsAt)
    );
  };
  // Unlock tokens from Escrow (user2) ...
 const stakeVehoney = async () => {
    const lt = program.addEventListener("ExitEscrowEvent", (e, s) => {
      console.log("Exit Escrow in Slot: ", s);
      console.log("Locker: ", e.locker.toString());
      console.log("Escorw Onwer: ", e.escrowOwner.toString());
      console.log("Locked Supply: ", e.lockedSupply.toString());
      console.log("Released Amount: ", e.releasedAmount.toString());
      console.log("Timestamp: ", e.timestamp.toString());
    });

    userHoneyToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      honeyMint.publicKey,
      user.publicKey
    );

    const lockerAccountBefore = await program.account.locker.fetch(locker);
    const escrowAccountBefore = await program.account.escrow.fetch(escrow);

    // await sleep(6000);

    await program.rpc
      .exit({
        accounts: {
          payer: user.publicKey,
          locker,
          escrow,
          escrowOwner: user.publicKey,
          lockedTokens,
          destinationTokens: userHoneyToken,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        preInstructions: [
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            honeyMint.publicKey,
            userHoneyToken,
            user.publicKey,
            user.publicKey
          ),
        ],
        signers: [user],
      })
      .finally(() => {
        setTimeout(() => {
          program.removeEventListener(lt);
        }, 2000);
      });

    const lockerAccountAfter = await program.account.locker.fetch(locker);

    assert.ok(
      lockerAccountBefore.lockedSupply
        .sub(escrowAccountBefore.amount)
        .eq(lockerAccountAfter.lockedSupply)
    );
  };

  // Reclaim mint authority of Honey mint
  const reclaimMintAuthority = async () => {
    await stakeProgram.rpc.reclaimMintAuthority(
      vaultAuthorityBump,
      honeyMintAuthority.publicKey,
      {
        accounts: {
          tokenMint: honeyMint.publicKey,
          pTokenMint: pHoneyMint.publicKey,
          tokenVault,
          authority: vaultAuthority,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );

    const honeyMintAccount = await honeyMint.getMintInfo();
    // assert.ok(
    //   honeyMintAccount.mintAuthority.equals(honeyMintAuthority.publicKey)
    // );
  };

    //   Revoke program lock privilege
const revokeProgramLockPrivilege = async () => {
    const lt = program.addEventListener("RevokeLockPrivilegeEvent", (e, s) => {
      console.log("Revoke lock privilege in Slot: ", s);
      console.log("Locker: ", e.locker.toString());
      console.log("ProgramId: ", e.programId.toString());
      console.log("Timestamp: ", e.timestamp.toString());
    });

    await program.rpc
      .revokeProgramLockPrivilege({
        accounts: {
          payer: payer.publicKey,
          locker,
          lockerAdmin: admin.publicKey,
          whitelistEntry,
          executableId: stakeProgram.programId,
        },
        signers: [admin],
      });

    try {
      await program.account.whitelistEntry.fetch(whitelistEntry);
    } catch (_) {
      assert.ok(true);
    }
  };
};