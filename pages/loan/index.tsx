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
} from '@honey-finance/sdk';
import { PublicKey } from '@solana/web3.js';


const Loan: NextPage = () => {
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
      positions: 0
    }
  ];
  /**
   * @description base sdk config object
   * @params none
   * @returns connection | wallet | jetID
  */
  const sdkConfig = {
    saberHqConnection: useConnection(),
    sdkWallet: useConnectedWallet(),
    honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
    // marketID: 'CqFM8kwwkkrwPTVFZh52yFNSaZ3kQPDADSobHeDEkdj3'
    marketID: 'GLBPMnxYr5QkkF4o5SMug7B5DmPSDDdAw7W46RgZdRyf'
  }

  /**
   * @description calls upon the honey sdk - market 
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);
  const { market, marketReserveInfo, parsedReserves }  = useHoney();

  useEffect(() => {
    console.log("Market:", market);
    console.log("Market Reserve Info: ", marketReserveInfo);
    console.log("Reserves: ", parsedReserves);
  }, [market, marketReserveInfo, parsedReserves]);

  useEffect(() => {
    console.log(honeyClient, honeyUser, honeyReserves);
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
   * @description calls upon useHoney
   * @params none
   * @returns context
  */
  const initializeHoney = useHoney();

  /**
   * @description calls upon useBorrowPositions
   * @params connection && wallet && JET ID
   * @returns TBorrowPosition array of data
  */
  const getBorrowPoistions = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  useEffect(() => {
    console.log(getBorrowPoistions);
  }, [getBorrowPoistions])

  /**
   * @description should return available pools which render in the interface table
   * @params connection && wallet && JET ID
   * @returns a table of pools
  */
  const getPools = usePools(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  useEffect(() => {
    console.log(getPools);
  }, [getPools]);

  /**
   * @description extract functionalities from honeyUser
   * @params none
   * @returns requested value
  */

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
    const tokenAmount = 0.1;
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    await deposit(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
  }

  async function executeWithdraw() {
    const tokenAmount = 0.1;
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    await withdraw(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
  }

  async function executeDepositNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "FG1n7yGdxzge6EtJu1H5oLEc2ppPh3Tec8WSN8epxWcY")
    depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function executeWithdrawNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "FG1n7yGdxzge6EtJu1H5oLEc2ppPh3Tec8WSN8epxWcY");
    withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }


  /**
   * @description gets loans held by user
   * @params none
   * @returns array of tokens
  */
  function initializeLoan() {
    const userLoans = honeyUser.loans();
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
                  {
                    title: 'Borrow',
                    onClick: () => { setLiveOrCompleted(0) }
                  },
                  { title: 'Deposit NFT', onClick: () => { executeDepositNFT() } },
                  { title: 'Withdraw NFT', onClick: () => { executeWithdrawNFT(); } },
                  { title: 'Despoit 0.1 SOL', onClick: () => { executeDeposit() } },
                  { title: 'Withdraw 0.1 SOL', onClick: () => { executeWithdraw() } },
                  { title: 'Loan', onClick: () => setLiveOrCompleted(1) },
                  { title: 'print reserves', onClick: () => console.log(reserves)}
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
