// const assert = require("assert");
// import * as anchor from "@project-serum/anchor";
// import { Program } from "@project-serum/anchor";
// import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
// import { VeHoney } from "../types/ve_honey";
// import { Stake } from "../types/stake";
// import * as constants from "../../constants/vehoney";
// // import kp from './keypair.json'


// // const idl = JSON.parse(fs.readFileSync("./target/idl/ve_honey.json", "utf8"));
// // const programId = new anchor.web3.PublicKey(
// //   "CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q"
// // );
// const clusterUrl = "https://api.devnet.solana.com";
// // const clusterUrl = "http://127.0.0.1:8899";

// // read this from local file 
// const payer = anchor.web3.Keypair.generate();  
// const connection = new anchor.web3.Connection(clusterUrl, "processed");
// const provider = new anchor.Provider(connection, new anchor.Wallet(payer), {
//   skipPreflight: false,
//   preflightCommitment: "processed",
//   commitment: "processed",
// });
// anchor.setProvider(provider);
// const program = anchor.workspace.VeHoney as Program<VeHoney>;
// // const program = new Program(idl, programID, provider)

// const publicConnection = new anchor.web3.Connection(clusterUrl, {
//   commitment: "processed",
// });

// const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
// const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;
// const LAMPORTS_PER_SOL = anchor.web3.LAMPORTS_PER_SOL;

// const admin = anchor.web3.Keypair.generate(); //
// const user = anchor.web3.Keypair.generate();
// let honeyMint: Token;
// let pHoneyMint: Token;
// const honeyMintAuthority = anchor.web3.Keypair.generate(); // import
// const pHoneyMintAuthority = anchor.web3.Keypair.generate(); // import from file 
// const base = anchor.web3.Keypair.generate(); // import from file
// let userPHoneyToken: anchor.web3.PublicKey,
//   userHoneyToken: anchor.web3.PublicKey,
//   locker: anchor.web3.PublicKey,
//   escrow: anchor.web3.PublicKey,
//   lockedTokens: anchor.web3.PublicKey,
//   whitelistEntry: anchor.web3.PublicKey;
// const lockerParams = {
//   whitelistEnabled: true,
//   minStakeDuration: new anchor.BN(1),
//   maxStakeDuration: new anchor.BN(5),
//   multiplier: 48,
// };
// const stakeProgram = anchor.workspace.Stake as Program<Stake>;
// let tokenVault: anchor.web3.PublicKey,
//   tokenVaultBump: number,
//   vaultAuthority: anchor.web3.PublicKey,
//   vaultAuthorityBump: number;


//   async () => {

//     userHoneyToken = await Token.getAssociatedTokenAddress(
//       ASSOCIATED_TOKEN_PROGRAM_ID,
//       TOKEN_PROGRAM_ID,
//       honeyMint.publicKey,
//       user.publicKey
//     );

//     await stakeProgram.rpc.claim({
//       accounts: {
//         payer: user.publicKey,
//         poolInfo: stakePool,
//         authority: vaultAuthority,
//         tokenMint: honeyMint.publicKey,
//         userInfo: poolUser,
//         userOwner: user.publicKey,
//         destination: userHoneyToken,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       },
//       preInstructions: [
//         Token.createAssociatedTokenAccountInstruction(
//           ASSOCIATED_TOKEN_PROGRAM_ID,
//           TOKEN_PROGRAM_ID,
//           honeyMint.publicKey,
//           userHoneyToken,
//           user.publicKey,
//           user.publicKey
//         ),
//       ],
//       signers: [user],
//     });