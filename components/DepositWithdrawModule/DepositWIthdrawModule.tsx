import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'
import LoanDeposit from '../LoanDeposit';
import LoanWithdraw from '../LoanWithdraw';
import * as styles from './DepositWithdrawModule.css';
import ToggleSwitchLoan from '../ToggleSwitchLoan';

type TButton = {
  title: string;
  disabled: boolean;
  hidden?: boolean;
  onClick: () => void;
};
interface DepositWithdrawModuleProps {
  // isFetching: boolean;
  // NFTs: NFT[];
  // selectedNFTs: NFT[];
  // title: string;
  // buttons: TButton[];
  // onNFTSelect: Function | null;
  // onNFTUnselect: (NFT: NFT) => void;
}

const DepositWithdrawModule = (props: DepositWithdrawModuleProps) => {
  const {
    // NFTs,
    // selectedNFTs,
    // title,
    // buttons,
    // onNFTSelect,
    // onNFTUnselect,
    // isFetching
  } = props;

  const [depositOrWithdraw, setDepositOrWithdraw] = useState(0);

  return (
    <Box className={styles.cardContainer}>
      <Box width="full" padding="8" className={styles.cardWrapper}>
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
        {
          depositOrWithdraw == 0  ? (
            <LoanDeposit
              borrowApy={1}
              estValue={1}
              assetsBorrowed={1}
              netBorrowBalance={1}

            />
            ) : (
              <LoanWithdraw
                nftName={'test'}
                evaluation={1}
                interestRate={1}
                assetsBorrowed={1}
                totalInterest={1}
                totalPayback={1}
              />
            )
        };
      </Box>
    </Box>
  );
};

export default DepositWithdrawModule;
