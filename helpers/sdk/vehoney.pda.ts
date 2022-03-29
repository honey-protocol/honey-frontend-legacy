// import { PublicKey } from '@solana/web3.js';
// import { STAKE_PROGRAM_ID, VE_HONEY_PROGRAM_ID } from './index';
// import * as constants from '../../constants/vehoney';



// export const findPoolUserAddress = await anchor.web3.PublicKey.findProgramAddress(
//   [
//     Buffer.from(constants.POOL_USER_SEED),
//     stakePool.toBuffer(),
//     user.publicKey.toBuffer(),
//   ],
//   STAKE_PROGRAM_ID
// );

// [stakePool] = await anchor.web3.PublicKey.findProgramAddress(
//   [
//     Buffer.from(constants.POOL_INFO_SEED),
//     honeyMint.publicKey.toBuffer(),
//     pHoneyMint.publicKey.toBuffer(),
//   ],
//   stakeProgram.programId
// );

// [poolUser] = await anchor.web3.PublicKey.findProgramAddress(
//   [
//     Buffer.from(constants.POOL_USER_SEED),
//     stakePool.toBuffer(),
//     user.publicKey.toBuffer(),
//   ],
//   stakeProgram.programId
// );


// let lockerBump: number;
// [locker, lockerBump] = await anchor.web3.PublicKey.findProgramAddress(
//   [Buffer.from(constants.LOCKER_SEED), base.publicKey.toBuffer()],
//   program.programId
// );


// userHoneyToken = await Token.getAssociatedTokenAddress(
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   TOKEN_PROGRAM_ID,
//   honeyMint.publicKey,
//   user.publicKey
// );


// [escrow, escrowBump] = await anchor.web3.PublicKey.findProgramAddress(
//   [
//     Buffer.from(constants.ESCROW_SEED),
//     locker.toBuffer(),
//     user.publicKey.toBuffer(),
//   ],
//   program.programId
// );

// lockedTokens = await Token.getAssociatedTokenAddress(
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   TOKEN_PROGRAM_ID,
//   honeyMint.publicKey,
//   escrow,
//   true
// );
