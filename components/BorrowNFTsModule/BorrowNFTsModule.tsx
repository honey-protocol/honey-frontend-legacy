import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'
import LoanBorrow from '../../components/LoanBorrow';
import LoanRepay from '../../components/LoanRepay';
import * as styles from './BorrowNFTsModule.css';
import ToggleSwitchLoan from '../../components/ToggleSwitchLoan';

type TButton = {
  title: string;
  disabled: boolean;
  hidden?: boolean;
  onClick: () => void;
};
interface BorrowNFTsModule {
  // isFetching: boolean;
  // NFTs: NFT[];
  // selectedNFTs: NFT[];
  // title: string;
  // buttons: TButton[];
  // onNFTSelect: Function | null;
  // onNFTUnselect: (NFT: NFT) => void;
}

const BorrowNFTsModule = (props: BorrowNFTsModule) => {
  const {
    // NFTs,
    // selectedNFTs,
    // title,
    // buttons,
    // onNFTSelect,
    // onNFTUnselect,
    // isFetching
  } = props;

  const [borrowOrRepay, setBorrowOrRepay] = useState(0);

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <ToggleSwitchLoan
          buttons={[
            {
              title: 'Borrow',
              onClick: () => setBorrowOrRepay(0)
            },
            { title: 'Repay', onClick: () => setBorrowOrRepay(1) }
          ]}
          activeIndex={borrowOrRepay}
        />
        <hr></hr>
        {
          borrowOrRepay == 0  ? (
            <LoanBorrow
              borrowApy={1}
              estValue={1}
              assetsBorrowed={1}
              netBorrowBalance={1}
            />
            ) : (
              <LoanRepay
                nftName={'test'}
                evaluation={1}
                interestRate={1}
                assetsBorrowed={1}
                totalInterest={1}
                totalPayback={1}
              />
            )
        };
      </Card>
    </Box>
  );
};

export default BorrowNFTsModule;
