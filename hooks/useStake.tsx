import { useCallback, useEffect, useState } from 'react';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

import { StakeClient } from 'helpers/sdk/stake';
import { useAccounts } from './useAccounts';
import { HONEY_MINT, PHONEY_MINT } from 'helpers/sdk/constant';

export const useStake = (stakePool: PublicKey) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [sc, setSC] = useState<StakeClient | undefined>(undefined);
  const { tokenAccounts } = useAccounts();
  const [pool, setPool] = useState<any>(undefined);
  const [userKey, setUserKey] = useState<PublicKey | null>(null);
  const [user, setUser] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
  const honeyToken = tokenAccounts.find(t => t.info.mint.equals(HONEY_MINT));

  useEffect(() => {
    if (wallet && connection) {
      const sc = new StakeClient(connection, wallet as any);
      setSC(sc);
    }
  }, [wallet, connection]);

  const fetchInfo = async () => {
    if (sc) {
      setIsLoading(true);
      try {
        const pool = await sc.fetchPoolInfo(stakePool);
        const [userKey] = await sc.getUserPDA(stakePool);
        const user = await sc.fetchPoolUser(userKey);

        setPool(pool);
        setUserKey(userKey);
        setUser(user);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!sc || !stakePool) {
      setPool(undefined);
      setUser(undefined);
      setUserKey(null);

      setIsLoading(false);
    } else {
      fetchInfo();

      const timer = setInterval(() => {
        console.log('interval');
        fetchInfo();
      }, 10000);

      return () => {
        console.log('AGG');
        clearInterval(timer);
      };
    }
  }, [sc]);

  const createUser = useCallback(async () => {
    if (sc) {
      setIsLoading(true);
      try {
        await sc.initializeUser(stakePool);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  }, [sc]);

  const deposit = useCallback(
    async (amount: BN) => {
      if (sc && userKey && pHoneyToken) {
        setIsLoading(true);
        try {
          await sc.deposit(stakePool, userKey, pHoneyToken.pubkey, amount);
          setIsLoading(false);
        } catch (e) {
          console.log(e);
          setIsLoading(false);
        }
      }
    },
    [sc, userKey, pHoneyToken]
  );

  const claim = useCallback(async () => {
    if (sc && userKey) {
      setIsLoading(true);
      try {
        await sc.claim(stakePool, userKey, honeyToken?.pubkey);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  }, [sc, userKey, honeyToken]);

  return {
    pool,
    user: user
      ? {
          ...user,
          pubkey: userKey
        }
      : null,
    isLoading,
    createUser,
    deposit,
    claim
  };
};
