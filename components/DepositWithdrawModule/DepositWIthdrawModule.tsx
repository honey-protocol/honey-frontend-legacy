import React, { useState } from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'
import LoanDeposit from '../LoanDeposit';
import LoanWithdraw from '../LoanWithdraw';
import * as styles from './DepositWithdrawModule.css';
import ToggleSwitchLoan from '../ToggleSwitchLoan';
import ConfigureSDK from '../../helpers/config';
import {
    deposit,
    HoneyUser,
    depositNFT,
    withdrawNFT,
    useBorrowPositions,
    useMarket,
    usePools,
    useHoney,
    withdraw,
    borrow,
    repay,
  } from '@honey-finance/sdk';
  import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

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
  const sdkConfig = ConfigureSDK();
  const [solAmount, updateSolAMout] = useState(1);
  const {honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);


  async function executeDeposit() {
      const tokenAmount = 1 * LAMPORTS_PER_SOL;
      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      await deposit(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
  }
  
  async function executeWithdraw() {
    const tokenAmount = 1 * LAMPORTS_PER_SOL;
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    await withdraw(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
  }
    
  function handleWithdraw() {
      if (solAmount < 1) {
          return
      } else {
          executeWithdraw()
      }
  }

  function handleDeposit() {
    executeDeposit()
  }


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
              solAmount={solAmount}
              handleDeposit={handleDeposit}
            />
            ) : (
              <LoanWithdraw
                nftName={'test'}
                evaluation={1}
                interestRate={1}
                assetsBorrowed={1}
                totalInterest={1}
                totalPayback={1}
                solAmount={solAmount}
                handleWithdraw={handleWithdraw}
              />
            )
        };
      </Box>
    </Box>
  );
};

export default DepositWithdrawModule;
