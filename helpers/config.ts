import { useConnection, useConnectedWallet } from '@saberhq/use-solana';

export default function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
        marketID: 'HB82woFm5MrTx3X4gsRpVcUxtWJJyDBeT5xNGCUUrLLe'
    }
}
  