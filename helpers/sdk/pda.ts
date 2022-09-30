import { utils } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { HONEY_DAO_ADDRESSES } from 'helpers/dao';

export const findLockerAddress = async (
  base: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode('Locker'), base.toBuffer()],
    HONEY_DAO_ADDRESSES.LockedVoter
  );
};

export const findEscrowAddress = async (
  locker: PublicKey,
  authority: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode('Escrow'),
      locker.toBuffer(),
      authority.toBuffer()
    ],
    HONEY_DAO_ADDRESSES.LockedVoter
  );
};

export const findWhitelistAddress = async (
  locker: PublicKey,
  programId: PublicKey,
  owner: PublicKey | null
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode('LockerWhitelistEntry'),
      locker.toBuffer(),
      programId.toBuffer(),
      owner ? owner.toBuffer() : SystemProgram.programId.toBuffer()
    ],
    HONEY_DAO_ADDRESSES.LockedVoter
  );
};
