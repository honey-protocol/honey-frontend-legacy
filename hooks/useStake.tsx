import { useCallback, useEffect, useState } from 'react';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

import { StakeClient } from 'helpers/sdk/stake';
import { useAccounts } from './useAccounts';
import { HONEY_MINT, PHONEY_MINT } from 'helpers/sdk/constant';
import { VeHoneyClient } from 'helpers/sdk';

export const useStake = (stakePool: PublicKey, locker: PublicKey) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const [sc, setSC] = useState<StakeClient | undefined>(undefined);
  const [vc, setVC] = useState<VeHoneyClient | undefined>(undefined);
  const { tokenAccounts } = useAccounts();
  const [pool, setPool] = useState<any>(undefined);
  const [userKey, setUserKey] = useState<PublicKey | undefined>(undefined);
  const [user, setUser] = useState<any>(undefined);
  const [lockerAcc, setLocker] = useState<any>(undefined);
  const [escrowKey, setEscrowKey] = useState<PublicKey | undefined>(undefined);
  const [escrow, setEscrow] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
  const honeyToken = tokenAccounts.find(t => t.info.mint.equals(HONEY_MINT));

  useEffect(() => {
    if (wallet && connection) {
      const sc = new StakeClient(connection, wallet as any);
      const vc = new VeHoneyClient(connection, wallet as any);
      setSC(sc);
      setVC(vc);
    }
  }, [wallet, connection]);

  const fetchInfo = async () => {
    if (sc && vc) {
      setIsLoading(true);
      try {
        // console.log('pool: ', stakePool.toString());
        // console.log('locker: ', locker.toString());

        const pool = await sc.fetchPoolInfo(stakePool);
        const [userKey] = await sc.getUserPDA(stakePool);
        // console.log('user key: ', userKey.toString());
        const user = await sc.fetchPoolUser(userKey);
        const lockerAcc = await vc.fetchLocker(locker);
        const [escrowKey] = await vc.getEscrowPDA(locker);
        // console.log('escrow: ', escrowKey.toString());
        const escrow = await vc.fetchEscrow(escrowKey);

        setPool(pool);
        setUserKey(userKey);
        setUser(user);
        setLocker(lockerAcc);
        setEscrowKey(escrowKey);
        setEscrow(escrow);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!sc || !vc) {
      setPool(undefined);
      setUser(undefined);
      setUserKey(undefined);
      setLocker(undefined);
      setEscrow(undefined);
      setEscrowKey(undefined);

      setIsLoading(false);
    } else {
      fetchInfo();

      const timer = setInterval(() => {
        // console.log('interval');
        fetchInfo();
      }, 10000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [sc, vc]);

  // const createUser = useCallback(async () => {
  //   if (sc) {
  //     setIsLoading(true);
  //     try {
  //       await sc.initializeUser(stakePool);
  //       setIsLoading(false);
  //     } catch (e) {
  //       console.log(e);
  //       setIsLoading(false);
  //     }
  //   }
  // }, [sc]);

  const deposit = useCallback(
    async (amount: BN, hasUser: boolean = true) => {
      if (sc && userKey && pHoneyToken) {
        setIsLoading(true);
        try {
          await sc.deposit(
            stakePool,
            userKey,
            pHoneyToken.pubkey,
            amount,
            hasUser
          );
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
    if (sc) {
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

  const stake = useCallback(
    async (amount: BN, duration: BN, hasEscrow: boolean = true) => {
      if (sc && vc && userKey && pHoneyToken) {
        setIsLoading(true);
        try {
          await sc.stake(
            stakePool,
            locker,
            pHoneyToken.pubkey,
            vc,
            amount,
            duration,
            true,
            hasEscrow
          );
          setIsLoading(false);
        } catch (e) {
          console.log(e);
          setIsLoading(false);
        }
      }
    },
    [sc, vc, userKey, pHoneyToken]
  );

  const unlock = useCallback(async () => {
    if (vc) {
      setIsLoading(true);
      try {
        await vc.unlockEscrow(locker, escrowKey, honeyToken?.pubkey);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  }, [vc, escrowKey, honeyToken]);

  return {
    pool,
    user: user
      ? {
          ...user,
          pubkey: userKey
        }
      : null,
    locker: lockerAcc,
    escrow: escrow
      ? {
          ...escrow,
          pubkey: escrowKey
        }
      : null,
    isLoading,
    deposit,
    claim,
    stake,
    unlock
  };
};
