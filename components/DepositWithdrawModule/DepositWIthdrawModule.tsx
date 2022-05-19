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
  executeDeposit: () => void;
  executeWithdraw: () => void;
  honeyReserves: any;
}

const DepositWithdrawModule = (props: DepositWithdrawModuleProps) => {
  const {
    executeDeposit,
    executeWithdraw,
    honeyReserves
  } = props;

  const [depositOrWithdraw, setDepositOrWithdraw] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState('');

  function handleReserves(honeyR: any) {
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    
    const depositReserve = honeyR?.filter((reserve: any) =>
      reserve?.data?.tokenMint?.equals(depositTokenMint),
    )[0];

    const reserveState = depositReserve?.data?.reserveState;

    console.log('@@@@@_-------', reserveState?.totalDeposits.toString());

    setTotalDeposits(reserveState?.totalDeposits.toString())
  }

  useEffect(() => {
    handleReserves(honeyReserves);
  }, [honeyReserves]);

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
              totalDeposits={totalDeposits}

            />
          ) : (
            <LoanWithdraw
              evaluation={1}
              interestRate={1}
              assetsBorrowed={1}
              totalInterest={1}
              totalPayback={1}
              handleWithdraw={executeWithdraw}
              totalDeposits={totalDeposits}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default DepositWithdrawModule;
