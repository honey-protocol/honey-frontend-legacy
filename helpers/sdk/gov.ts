import type { GOKI_ADDRESSES } from '@gokiprotocol/client';
import { GokiSDK } from '@gokiprotocol/client';
import { useNativeAccount } from '@saberhq/sail';
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib';
import type { TokenAmount } from '@saberhq/token-utils';
import { useConnectedWallet, useConnectionContext } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { TribecaSDK } from '@tribecahq/tribeca-sdk';
import { useMemo } from 'react';
import { createContainer } from 'unstated-next';

export type ProgramKey = keyof typeof GOKI_ADDRESSES;

export const useSDKInternal = (): {
  sdk: GokiSDK;
  sdkMut: GokiSDK | null;
  owner: PublicKey | null;
  nativeBalance?: TokenAmount | null;
  tribecaMut: TribecaSDK | null;
} => {
  const { connection } = useConnectionContext();
  const wallet = useConnectedWallet();

  const { sdk: sdk } = useMemo(() => {
    const provider = SolanaProvider.init({
      connection,
      wallet: new SignerWallet(Keypair.generate()),
      opts: {
        commitment: 'recent'
      }
    });
    return {
      sdk: GokiSDK.load({ provider })
    };
  }, [connection]);

  const { sdkMut } = useMemo(() => {
    if (!wallet) {
      return { sdkMut: null };
    }
    const provider = SolanaProvider.init({
      connection,
      wallet,
      opts: {
        commitment: 'recent'
      }
    });
    return {
      sdkMut: GokiSDK.load({ provider })
    };
  }, [connection, wallet]);

  const tribecaMut = useMemo(() => {
    if (!wallet) {
      return null;
    }
    const provider = SolanaProvider.init({
      connection,
      wallet,
      opts: {
        commitment: 'recent'
      }
    });
    return TribecaSDK.load({ provider });
  }, [connection, wallet]);

  const owner = useMemo(
    () => sdkMut?.provider.wallet.publicKey ?? null,
    [sdkMut?.provider.wallet.publicKey]
  );
  const { nativeBalance } = useNativeAccount();

  return {
    owner,
    nativeBalance,
    sdk,
    sdkMut: sdkMut ?? null,
    tribecaMut
  };
};

export const { useContainer: useSDK, Provider: SDKProvider } =
  createContainer(useSDKInternal);
