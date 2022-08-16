import { calcVeHoneyAmount, convert, convertBnTimestampToDate } from "helpers/utils";
import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { PublicKey } from '@solana/web3.js';
import { useStake } from 'hooks/useStake';
import { HONEY_DECIMALS, HONEY_MINT, PHONEY_DECIMALS, PHONEY_MINT } from "helpers/sdk";
import { useAccounts } from "hooks/useAccounts";
import config from "../config"

type govContextType = {

    veHoneyAmount: number;
    lockedAmount: number;
    lockedPeriodEnd:string | number;
    pHoneyAmount: number;
    honeyAmount: number;
    depositedAmount: number;
    lockPeriodHasEnded: boolean;
};

const govContextDefaultValues: govContextType = {

    veHoneyAmount: 0,
    lockedAmount: 0,
    lockedPeriodEnd: "",
    pHoneyAmount: 0,
    honeyAmount: 0,
    depositedAmount: 0,
    lockPeriodHasEnded: false
};

const GovContext = createContext<govContextType>(govContextDefaultValues);

export function useGovernance() {
    return useContext(GovContext);
}

type Props = {
    children: ReactNode;
};

export function GovernanceProvider({ children }: Props) {
  const STAKE_POOL_ADDRESS = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
  const LOCKER_ADDRESS = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);
    
      const { user, escrow, totalVeHoney } = useStake(
        STAKE_POOL_ADDRESS,
        LOCKER_ADDRESS
      );
    
    // use token accounts for honey and phoney
    const { tokenAccounts } = useAccounts();
    const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
    const honeyToken = tokenAccounts.find(t => t.info.mint.equals(HONEY_MINT));
  
    // calculate user veHONEY amount locked
    const veHoneyAmount = useMemo(() => {
        if (!escrow) {
          return 0;
        }
        return calcVeHoneyAmount(
          escrow.escrowStartedAt,
          escrow.escrowEndsAt,
          escrow.amount
        );
      }, [escrow]);

    //  
      const lockedAmount = useMemo(() => {
        if (!escrow) {
          return 0;
        }
    
        return convert(escrow.amount, HONEY_DECIMALS);
      }, [escrow]);
    
    // locked period end date
    const lockedPeriodEnd = useMemo(() => {
      if (!escrow) {
        return 0;
      }
  
      return convertBnTimestampToDate(escrow.escrowEndsAt);
    }, [escrow]);

    // pHONEY amount deposited
    const pHoneyAmount = useMemo(() => {
      if (!pHoneyToken) {
        return 0;
      }
  
      return convert(pHoneyToken.info.amount, PHONEY_DECIMALS);
    }, [pHoneyToken]);

    // HONEY amount deposited
    const honeyAmount = useMemo(() => {
      if (!honeyToken) {
        return 0;
      }
  
      return convert(honeyToken.info.amount, HONEY_DECIMALS);
    }, [honeyToken]);
    
    // amount of pHoney deposited by user
    const depositedAmount = useMemo(() => {
      if (!user) {
        return 0;
      }
  
      return convert(user.depositAmount, PHONEY_DECIMALS);
    }, [user]);
    
    // locked period has ended 
    const lockPeriodHasEnded = useMemo((): boolean => {
      if (!escrow) {
        return true;
      }
      const lockEndsTimestamp = convert(escrow.escrowEndsAt, 0);
      const currentTimestamp = new Date().getTime();
  
      if (lockEndsTimestamp >= currentTimestamp) {
        return true;
      }
      return false;
    }, [escrow]);

    // the data that's passed to the provider 
    const value = {
        veHoneyAmount,
        lockedAmount,
        lockedPeriodEnd,
        pHoneyAmount,
        honeyAmount,
        depositedAmount,
        lockPeriodHasEnded
    };

    return (
        <>
            <GovContext.Provider value={value}>
                {children}
            </GovContext.Provider>
        </>
    );
}