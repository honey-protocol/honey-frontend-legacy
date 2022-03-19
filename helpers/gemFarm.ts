import { useState, useEffect } from 'react';
import {
  findFarmerPDA,
  findVaultPDA,
  stringifyPKsAndBNs
} from '@gemworks/gem-farm-ts';
import { Connection, PublicKey } from '@solana/web3.js';
import { GemBank, initGemBank } from '../gem-bank';
import { GemFarm, initGemFarm } from '../gem-farm';
import { programs } from '@metaplex/js';
import { BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { extractMetaData } from './utils';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

//eventStartDate in this format YYYY/MM/DD/Hr/Min, eventDuration in number of days
export default function getCollectionExpireDate(
  eventStartDate: string,
  eventDuration: string
) {
  const dateArray = eventStartDate.split('/').map((a, i) => {
    switch (i) {
      case 1:
        return Number(a) - 1;
      case 2:
        return Number(a) + Number(eventDuration);
      default:
        return Number(a);
    }
  });
  return new Date(
    Date.UTC(
      dateArray[0],
      dateArray[1],
      dateArray[2],
      dateArray[3],
      dateArray[4]
    )
  );
}

/**
 * @params
 * @description
 * @returns
 **/
export const fetchFarm = async (gf: GemFarm, farmAddress: string) => {
  const farmAccResult = await gf.fetchFarmAcc(new PublicKey(farmAddress));
  console.log(
    `farm found at ${farmAddress}:`,
    stringifyPKsAndBNs(farmAccResult)
  );
  return farmAccResult;
};

export const fetchVault = async (gb: GemBank, vault: PublicKey) => {
  const vaultAcc = await gb.fetchVaultAcc(vault);
  return vaultAcc;
};

/**
 * @params
 * @description
 * @returns
 **/
export const getRewardsFromFarmerAcc = (newFarmerAcc: any) => {
  const availableA = newFarmerAcc.rewardA.accruedReward
    .sub(newFarmerAcc.rewardA.paidOutReward)
    .toString();
  const availableB = newFarmerAcc.rewardB.accruedReward
    .sub(newFarmerAcc.rewardB.paidOutReward)
    .toString();
  return { availableA, availableB };
};

/**
 * @params
 * @description
 * @returns
 **/
//fetch farmers data
export const fetchFarmer = async (
  gf: GemFarm,
  gb: GemBank,
  farmAddress: string,
  walletAddress: PublicKey
) => {
  const [farmerPDA] = await findFarmerPDA(
    new PublicKey(farmAddress),
    walletAddress
  );
  const farmerAcc = await gf.fetchFarmerAcc(farmerPDA);
  const vaultAcc = await fetchVault(gb, farmerAcc.vault);
  const { availableA, availableB } = getRewardsFromFarmerAcc(farmerAcc);
  const farmerIdentity = walletAddress.toBase58();
  const farmerState = gf.parseFarmerState(farmerAcc);
  console.log(
    `farmer found at ${farmerIdentity}:`,
    stringifyPKsAndBNs(farmerAcc)
  );
  return {
    farmerAcc,
    vaultAcc,
    rewards: { availableA, availableB },
    farmerIdentity,
    farmerState
  };
};

//staking
/**
 * @params
 * @description
 * @returns
 **/
export const onDepositGems = async (
  gf: GemFarm,
  gb: GemBank,
  walletAddress: PublicKey,
  vaultAddress: PublicKey,
  bankAddress: PublicKey,
  nftMint: PublicKey,
  creator: PublicKey
) => {
  console.log('Adding single gem');
  //get token Account address
  const tokenAccResult = await PublicKey.findProgramAddress(
    [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

  const { txSig } = await gb.depositGemWallet(
    bankAddress,
    vaultAddress,
    new BN(1),
    nftMint,
    tokenAccResult[0],
    creator
  );
  console.log(txSig);
};

export const onWithdrawGems = async (
  gb: GemBank,
  bankAddress: string,
  farmerVaultAddress: string,
  nftMint: PublicKey
) => {
  console.log('removing a single gem', nftMint.toString());
  const { txSig } = await gb.withdrawGemWallet(
    new PublicKey(bankAddress),
    new PublicKey(farmerVaultAddress),
    new BN(1),
    nftMint
  );
  console.log(txSig);
};

// --------------------------------------- adding extra gem to locked vault
export const addSingleGem = async (
  gf: GemFarm,
  gemMint: PublicKey,
  creator: PublicKey,
  farmAddress: PublicKey,
  walletAddress: PublicKey
) => {
  //get token Account address
  const tokenAccResult = await PublicKey.findProgramAddress(
    [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), gemMint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

  await gf.flashDepositWallet(
    farmAddress!,
    '1',
    gemMint,
    tokenAccResult[0],
    creator
  );
  console.log('flash deposited');
};

//FETCH GEMS STAKED
export const getGemStakedInFarm = async (
  gb: GemBank,
  farmerVaultAddress: string,
  connection: Connection
) => {
  console.log('getting gems staked ');
  const foundGDRs = await gb.fetchAllGdrPDAs(
    new PublicKey(farmerVaultAddress!)
  );

  if (foundGDRs && foundGDRs.length) {
    const mints = foundGDRs.map((gdr: any) => {
      return { mint: gdr.account.gemMint };
    });

    //get metadata using mints
    let promises = mints.map(
      async mint => await extractMetaData(mint.mint, connection)
    );

    return await Promise.all(promises);
  } else {
    return [];
  }
};
