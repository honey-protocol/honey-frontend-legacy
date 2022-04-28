import { useConnection, useConnectedWallet } from '@saberhq/use-solana';

export default function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
        marketID: 'GLBPMnxYr5QkkF4o5SMug7B5DmPSDDdAw7W46RgZdRyf'
    }
}
  