import { useConnection, useConnectedWallet, ConnectedWallet } from '@saberhq/use-solana';
import BN from 'bn.js';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from 'constants/loan';
import { SBV2_DEVNET_PID } from '@switchboard-xyz/switchboard-v2';
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair } from '@solana/web3.js';
/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: HONEY_PROGRAM_ID,
        marketId: HONEY_MARKET_ID
    }
}

/**
 * @description exports function that validates if input is number
 * @params user input
 * @returns success or failure object
*/
export async function inputNumberValidator(val: any) {
    if (val >= 0 && val < 100) {
      return {
          success: true,
          message: '',
          value: val
      };
    } else {
      return {
        success: false,
        message: 'Please fill in a number between 0 and 100',
        value: val
      }
    }
}

export function BnToDecimal(val: BN | undefined, decimal: number, precision: number) {
  if(!val)
    return 0;
  return val.div(new BN(10 ** (decimal - precision))).toNumber() / (10 ** precision);
}

/**
 * Attempts to load Anchor IDL on-chain and falls back to local JSON if not found
 */
 export async function loadAnchor(wallet: ConnectedWallet | null): Promise<anchor.Program> {
  if (!SBV2_DEVNET_PID) {
    throw new Error("failed to provide PID environment variable");
  }
  const connection = new Connection("https://api.devnet.solana.com", { commitment: "confirmed" });
  const programId = new anchor.web3.PublicKey(SBV2_DEVNET_PID);


  if(wallet) {
    // get provider
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "processed",
      preflightCommitment: "processed",
    });

    // get idl
    const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
    if (!anchorIdl) {
      throw new Error(`failed to read idl for ${programId}`);
    }

    // const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
    // const anchorProgram: Program = new anchor.Program(idl as any, HONEY_PROGRAM_ID, provider);

    return new anchor.Program(anchorIdl, programId, provider);
  } else {
    throw new Error("Wallet can not be null");
  }


}