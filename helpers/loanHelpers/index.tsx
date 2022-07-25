import { useConnection, useConnectedWallet, ConnectedWallet } from '@saberhq/use-solana';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from 'constants/loan';
import { toast } from 'react-toastify';
import BN from 'bn.js';
import { Connection } from '@solana/web3.js';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        // saberHqConnection: new Connection("https://explorer-api.devnet.solana.com/"),
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
  if (val == '000' || val == '0000' ) {
    return {
      success: true,
      message: '',
      value: '00'
    }
  }
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

/**
 * @description
 * @params
 * @returns
*/
export async function toastResponse(responseType: string, message: string, id: any, triggerType?: string) {
  if (responseType == 'ERROR') {
    return toast.error(message, {toastId: responseType});
  } else if (responseType == 'LOADING') {
    const resolveP = new Promise(resolve => setTimeout(resolve, 4000));
    return toast.promise(
      resolveP,
      {
        pending: 'Loading data',
        success: 'Data loaded',
        error: 'An error occurred'
      },
      {
        toastId: responseType
      }
    )
  } else if (responseType == 'SUCCESS') {
    // success logic
    if (triggerType && (triggerType == 'BORROW' || triggerType == 'REPAY')) {
      return toast.success(message, {toastId: responseType});
    }

    if (triggerType && triggerType == 'CLAIM_NFT') {
      // write logic to call open positions refresh function
      return toast.success(message, {toastId: responseType});
    }
    // return toast.success(message, {toastId: responseType});
  } else if (responseType == 'LIQUIDATION') {
    return toast.success(message, {toastId: responseType});
  }
}
/**
 * @description
 * @params
 * @returns
*/
export const asyncTimeout = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * @description
 * @params
 * @returns
*/
export function BnToDecimal(val: BN | undefined, decimal: number, precision: number) {
  if(!val)
    return 0;
  return val.div(new BN(10 ** (decimal - precision))).toNumber() / (10 ** precision);
}