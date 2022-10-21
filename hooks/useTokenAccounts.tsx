import { ConnectedWallet, useConnectedWallet as useWallet, useConnection } from '@saberhq/use-solana';
import { useRequest } from "ahooks";
import { TOKEN_PROGRAM_ID, AccountLayout, RawAccount, AccountState } from "@solana/spl-token-v2";
import { WRAPPED_SOL } from '@saberhq/token-utils';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';

export const useTokenAccounts = () => {
  const connection = useConnection();
  const { publicKey, connected } = useWallet() as ConnectedWallet;

  const fn = async (): Promise<RawAccount[]> => {
    if (!publicKey) return [];
    const results = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    const solBalance = await connection.getBalance(publicKey);
    const rawAccounts = results.value
      .map((e) => AccountLayout.decode(e.account.data))
      .filter((e) => !!e) as RawAccount[];
    const wsolRawAccount = {
      mint: new PublicKey(WRAPPED_SOL['mainnet-beta'].address),
      owner: publicKey,
      amount: new BN(solBalance),
      delegateOption: 0,
      delegate: publicKey,
      state: AccountState.Initialized,
      isNativeOption: 0,
      isNative: new BN(0),
      delegatedAmount: new BN(0),
      closeAuthorityOption: 0,
      closeAuthority: publicKey
    };
    rawAccounts.push(wsolRawAccount as any);
    return rawAccounts;
  };

  return useRequest(fn, {
    refreshDeps: [connected, publicKey, connection.rpcEndpoint],
    pollingInterval: 5_000,
  });
};
