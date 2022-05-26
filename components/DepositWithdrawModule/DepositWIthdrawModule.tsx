import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import LoanDeposit from '../LoanDeposit';
import LoanWithdraw from '../LoanWithdraw';
import * as styles from './DepositWithdrawModule.css';
import ToggleSwitchLoan from '../ToggleSwitchLoan';
import ToggleSwitch from 'components/ToggleSwitch';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface DepositWithdrawModuleProps {
  executeDeposit: (val: any) => void;
  executeWithdraw: (val: any) => void;
  honeyReserves: any;
  userDebt: any;
}

const DepositWithdrawModule = (props: DepositWithdrawModuleProps) => {
  const {
    executeDeposit,
    executeWithdraw,
    honeyReserves,
    userDebt
  } = props;
  /**
   * @description
   * @params
   * @returns
  */
  const [depositOrWithdraw, setDepositOrWithdraw] = useState(0);

  useEffect(() => {
    console.log('@@@@@@@ being updated', userDebt)
  }, [userDebt])

  return (
    <Box
      height="full"
      borderRadius="2xLarge"
      overflow="hidden"
      className={styles.cardContainer}
    >
      <Card width="full" padding="6" level="2">
        <Box height="full" display="flex" flexDirection="column">
          <ToggleSwitchLoan
            buttons={[
              {
                title: 'Deposit',
                onClick: () => setDepositOrWithdraw(0)
              },
              { title: 'Withdraw', onClick: () => setDepositOrWithdraw(1) }
            ]}
            activeIndex={depositOrWithdraw}
          />
          {depositOrWithdraw == 0 ? (
            <LoanDeposit
              borrowApy={1}
              estValue={1}
              assetsBorrowed={1}
              netBorrowBalance={1}
              handleDeposit={executeDeposit}
              userDebt={userDebt}
            />
          ) : (
            <LoanWithdraw
              evaluation={1}
              interestRate={1}
              assetsBorrowed={1}
              totalInterest={1}
              totalPayback={1}
              handleWithdraw={executeWithdraw}
              userDebt={userDebt}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default DepositWithdrawModule;
