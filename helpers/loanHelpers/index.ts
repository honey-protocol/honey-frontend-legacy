import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import BN from 'bn.js';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from 'constants/loan';

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