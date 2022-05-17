import { useConnection, useConnectedWallet } from '@saberhq/use-solana';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: 'BmdNpm85xLcZCY9nAT6YB9reeFYRDaAUQorr4hEXh8ZL',
        marketId: '4sTsyFJzuBLv4Znp1uMKhkjEN7uWtubscYqDLk77Rhfp'
    }
}