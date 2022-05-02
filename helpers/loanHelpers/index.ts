import { useConnection, useConnectedWallet } from '@saberhq/use-solana';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export async function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: process.env.HONEY_ID,
        marketID: process.env.MARKET_ID
    }
}


