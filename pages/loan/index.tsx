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
import { useMarket, usePools, useBorrowPositions, METADATA_PROGRAM_ID } from '@honey-finance/sdk/lib/hooks';
import { useHoney } from '@honey-finance/sdk/lib/contexts';
import { PublicKey } from '@solana/web3.js';
import ConfigureSDK  from '../../helpers/config';

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
      positions: 0,
    }
  ];

  /**
   * @description base sdk config object
   * @params none
   * @returns connection | wallet | jetID
  */
  const sdkConfig = ConfigureSDK()

  /**
   * @description calls upon the honey sdk - market 
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet, sdkConfig.honeyId, sdkConfig.marketID);
 
  useEffect(() => {
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
   * @description should return available pools which render in the interface table
   * @params connection && wallet && JET ID
   * @returns a table of pools
  */
  const getPools = usePools(sdkConfig.saberHqConnection, sdkConfig.sdkWallet, sdkConfig.honeyId, sdkConfig.marketID);

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

  const openLoanModal  = wallet && liveOrCompleted === 1
  const loadLoanPage = wallet && liveOrCompleted === 0

  function showLoanModal() {
    setModalIsVisible(true);
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
