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
        honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
        marketId: '3dGcrf6GcvocfkgwS2i7YpJeWvVZdiMELc69UFVGZ4TR'
    }
}