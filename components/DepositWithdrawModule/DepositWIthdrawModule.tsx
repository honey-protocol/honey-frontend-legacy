import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import LoanDeposit from '../LoanDeposit';
import LoanWithdraw from '../LoanWithdraw';
import * as styles from './DepositWithdrawModule.css';
import ToggleSwitchLoan from '../ToggleSwitchLoan';
import ToggleSwitch from 'components/ToggleSwitch';

type TButton = {
  title?: string;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: (key?: any) => void;
};
interface DepositWithdrawModuleProps {
  executeDeposit?: (value: number) => void;
  executeWithdraw?: (value: number) => void;
}

const DepositWithdrawModule = (props: DepositWithdrawModuleProps) => {
  const {
    executeDeposit,
    executeWithdraw
  } = props;

  const [depositOrWithdraw, setDepositOrWithdraw] = useState(0);

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
              handleDeposit={(value: number) => executeDeposit}
            />
          ) : (
            <LoanWithdraw
              nftName={'test'}
              evaluation={1}
              interestRate={1}
              assetsBorrowed={1}
              totalInterest={1}
              totalPayback={1}
              handleWithdraw={(value: number) => executeWithdraw}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default DepositWithdrawModule;
