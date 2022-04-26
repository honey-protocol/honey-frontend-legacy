import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card } from 'degen';
import { Stack } from 'degen';
import { Button } from 'degen';
import { IconPlusSmall, IconSearch } from 'degen';
import { Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import DepositWithdrawModule from '../../components/DepositWithdrawModule/DepositWIthdrawModule';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import LoanHeaderComponent from 'components/LoanHeaderComponent/LoanHeaderComponent';
import ConfigureSDK from 'helpers/config';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
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


const Loan: NextPage = () => {
  const [hUser, updateUser] = useState('')
  /**
   * @description base sdk config object
   * @params none
   * @returns connection | wallet | jetID
  */
   const sdkConfig = ConfigureSDK();

  

   /**
    * @description calls upon the honey sdk - market 
    * @params solanas useConnection func. && useConnectedWallet func. && JET ID
    * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
   */
   const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);
   const { market, marketReserveInfo, parsedReserves }  = useHoney();
  /**
 * @description object layout for pools table - should be filled by getPools()
 * @params none
 * @returns dummy object
*/
  const assetData: Array<AssetRowType> = [
    {
      vaultName: 'Solana Monkey Business',
      vaultImageUrl:
        '/nfts/2738.png',
      totalBorrowed: 0,
      interest: 0,
      available: 0,
      positions: 0,
    }
  ];

  useEffect(() => {
    console.log("market: ", market);
    console.log("Market reserve info ", marketReserveInfo);
    console.log("Parsed Reserves ", parsedReserves);
  }, [market, marketReserveInfo, parsedReserves])

  useEffect(() => {
    console.log(honeyClient, 'the honeyUser;', honeyUser, honeyReserves);
  }, [honeyClient, honeyUser, honeyReserves]);

  // TODO:: Setup to work with SDK wallet 
  /**
   * @description PRE-SDK implementation: should be converted to new SDK implementation 
   * @params none
   * @returns modals 
  */
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  /**
   * @description calls upon useBorrowPositions
   * @params connection && wallet && HONEY_PROGRAM_ID
   * @returns TBorrowPosition array of data
  */
  const { loading, collateralNFTPositions, loanPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  useEffect(() => {
    console.log("collateral nft positions ", collateralNFTPositions);
    console.log("loan positions: ", loanPositions);
  }, [collateralNFTPositions, loanPositions])

  /**
   * @description component logic regarding handlers and modals
   * @params none unless specified above function declaration
   * @returns modal
  */
  const [liveOrCompleted, setLiveOrCompleted] = useState(0);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const openLoanModal = wallet && liveOrCompleted === 1
  const loadLoanPage = wallet && liveOrCompleted === 0

  function showLoanModal() {
    setModalIsVisible(true);
  }

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

  async function executeDepositNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "3W3BUk69PBSDj1tqinjfjtmEAZL9oFyVzcYiS6JjPJYV")
    depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function executeWithdrawNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "3W3BUk69PBSDj1tqinjfjtmEAZL9oFyVzcYiS6JjPJYV");
    withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function executeBorrow() {
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, 1 * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);
    console.log(tx);
  }

  async function executeRepay() {
    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, 1 * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
    console.log(tx);
  }

  return (
    <Layout>
      <Stack>
        <ModalContainer
          onClose={() => setModalIsVisible(false)}
          isVisible={modalIsVisible}
        >
          <DepositWithdrawModule />
        </ModalContainer>
        <Box className={styles.headerDivider}>
          <Box className={styles.leftComponent}>
            <Stack>
              <ToggleSwitch
                buttons={[
                  // { title: 'Despoit 1 SOL', onClick: () => { executeDeposit() } },
                  // { title: 'Withdraw 1 SOL', onClick: () => { executeWithdraw() } },
                  {
                    title: 'Borrow',
                    onClick: () => setLiveOrCompleted(0)
                  },
                  { title: 'Loan', onClick: () => setLiveOrCompleted(1) }
                ]}
                activeIndex={liveOrCompleted}
              />
            </Stack>
          </Box>
          <LoanHeaderComponent />
        </Box>
        <Box
          backgroundColor="backgroundTertiary"
          minWidth="full"
          gap="3"
          borderRadius="2xLarge"
          padding="5"
          width="full"
        >
          <Stack>
            <Box className={styles.cardMenuContainer}>
              <Box padding="1">
                <Input
                  label=""
                  placeholder="Search by name"
                  prefix={<IconSearch />}
                />
              </Box>
              <Text>Total borrowed</Text>
              <Text>Interest</Text>
              <Text>Available</Text>
              <Text>Your positions</Text>
            </Box>
            <Box>
              <hr className={styles.lineDivider}></hr>
            </Box>
            <Stack>
              <Box>
                {assetData.map(item => (
                  <Box key={item.vaultName}>
                    {loadLoanPage &&
                      <Link href="/loan/[name]" as={`/loan/${item.vaultName}`}>
                        <a>
                          <AssetRow data={item} />
                        </a>
                      </Link>
                    }
                    {openLoanModal &&
                      <Box onClick={showLoanModal} cursor="pointer">
                        <AssetRow data={item} />
                      </Box>
                    }
                    {!wallet &&
                      <Box onClick={connect} cursor="pointer">
                        <AssetRow data={item} />
                      </Box>
                    }
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};


export default Loan;
