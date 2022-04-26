import React, { useState } from 'react';
import { Box, Card, Stack } from 'degen';
import LoanBorrow from '../../components/LoanBorrow';
import LoanRepay from '../../components/LoanRepay';
import * as styles from './BorrowNFTsModule.css';
import ToggleSwitchLoan from '../../components/ToggleSwitchLoan';
import ToggleSwitch from 'components/ToggleSwitch';

interface BorrowNFTsModule {
  NFT: {
    name: string;
    image: string;
    borrowApy: string;
    estValue: string;
    assetsBorrowed: number;
    netBorrowBalance: number;
    key: number;
  };
}

const BorrowNFTsModule = (props: BorrowNFTsModule) => {
  const { NFT } = props;

  const [borrowOrRepay, setBorrowOrRepay] = useState(0);

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Stack space="5">
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
          {borrowOrRepay == 0 ? (
            <LoanBorrow NFT={NFT} />
          ) : (
            <LoanRepay NFT={NFT} />
          )}
        </Stack>
      </Card>
    </Box>
  );
};

export default BorrowNFTsModule;
