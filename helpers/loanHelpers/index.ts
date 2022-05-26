import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
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
    const regex = new RegExp('^[0-9]*$');
    if (regex.test(val) == false) {
        return {
            success: false,
            message: 'Only numbers allowed'
        };
    }
    return {
        success: true,
        message: ''
    }
}