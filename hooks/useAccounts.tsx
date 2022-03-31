import { useCallback, useEffect, useState } from 'react';
import { PublicKey, AccountInfo } from '@solana/web3.js';
import {
  AccountLayout,
  AccountInfo as TokenAccountInfo,
  TOKEN_PROGRAM_ID,
  u64
} from '@solana/spl-token';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';

export interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
  info: TokenAccountInfo;
}

export const useAccounts = () => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const ownerAddress = wallet?.publicKey;

  const fetchUserTokenAccounts = useCallback(async () => {
    if (!ownerAddress) {
      return;
    }

    const accounts = await connection.getTokenAccountsByOwner(ownerAddress, {
      programId: TOKEN_PROGRAM_ID
    });

    const tokenAccounts = accounts.value.map(info => {
      const data = deserializeAccount(info.account.data);

      return {
        pubkey: info.pubkey,
        account: {
          ...info.account
        },
        info: data
      } as TokenAccount;
    });

    setTokenAccounts(tokenAccounts);
  }, [connection, ownerAddress]);

  useEffect(() => {
    if (!connection || !ownerAddress) {
      setTokenAccounts([]);
    } else {
      fetchUserTokenAccounts();

      const timer = setInterval(() => {
        fetchUserTokenAccounts();
      }, 10000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [connection, ownerAddress]);

  return {
    tokenAccounts,
    fetchUserTokenAccounts
  };
};

const deserializeAccount = (data: Buffer) => {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};
