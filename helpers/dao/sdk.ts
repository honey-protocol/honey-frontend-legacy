import type { BN } from '@project-serum/anchor';
import { newProgramMap } from '@saberhq/anchor-contrib';
import type { AugmentedProvider, Provider } from '@saberhq/solana-contrib';
import {
  SolanaAugmentedProvider,
  TransactionEnvelope
} from '@saberhq/solana-contrib';
import type { PublicKey, Signer } from '@solana/web3.js';
import { Keypair, SystemProgram } from '@solana/web3.js';

import type { TribecaPrograms } from './constants';
import {
  DEFAULT_LOCKER_PARAMS,
  HONEY_DAO_ADDRESSES,
  HONEY_DAO_IDLS
} from './constants';
import type { LockerParams } from './programs/lockedVoter';
import { GovernWrapper } from './wrappers';
import { findLockerAddress } from './wrappers/lockedVoter/pda';

/**
 * TribecaSDK.
 */
export class TribecaSDK {
  constructor(
    readonly provider: AugmentedProvider,
    readonly programs: TribecaPrograms
  ) {}

  /**
   * Creates a new instance of the SDK with the given keypair.
   */
  withSigner(signer: Signer): TribecaSDK {
    return TribecaSDK.load({
      provider: this.provider.withSigner(signer)
    });
  }

  /**
   * Loads the SDK.
   * @returns
   */
  static load({ provider }: { provider: Provider }): TribecaSDK {
    const programs: TribecaPrograms = newProgramMap<TribecaPrograms>(
      provider,
      HONEY_DAO_IDLS,
      HONEY_DAO_ADDRESSES
    );
    return new TribecaSDK(new SolanaAugmentedProvider(provider), programs);
  }

  /**
   * Govern program helpers.
   */
  get govern(): GovernWrapper {
    return new GovernWrapper(this);
  }

  /**
   * Creates a Locker, which is an Electorate that supports vote locking.
   * @returns
   */
  async createLocker({
    governor,
    govTokenMint,
    wlTokenMint,
    baseKP = Keypair.generate(),
    ...providedLockerParams
  }: {
    baseKP?: Keypair;
    governor: PublicKey;
    govTokenMint: PublicKey;
    wlTokenMint: PublicKey;
  } & Partial<LockerParams>): Promise<{
    locker: PublicKey;
    tx: TransactionEnvelope;
  }> {
    const [locker] = await findLockerAddress(baseKP.publicKey);
    const lockerParams = {
      ...DEFAULT_LOCKER_PARAMS,
      ...providedLockerParams
    };
    return {
      locker,
      tx: new TransactionEnvelope(
        this.provider,
        [
          this.programs.LockedVoter.instruction.initLocker(lockerParams, {
            accounts: {
              base: baseKP.publicKey,
              governor,
              locker,
              tokenMint: govTokenMint,
              wlTokenMint: wlTokenMint,
              payer: this.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId
            }
          })
        ],
        [baseKP]
      )
    };
  }
}
