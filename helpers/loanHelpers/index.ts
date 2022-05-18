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
        marketId: '9Hd2ZWmdGoBco3bo33pf1ydh9JAGQ5c8LNuduAvKL9o4'
    }
}