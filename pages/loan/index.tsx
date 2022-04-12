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
import { useMarket } from '@honey-defi/sdk'

/**
 * @description base dummy data object - should be converted to returns from honey SDK
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

const Loan: NextPage = () => {
  /**
   * @description Calls upon the honey sdk 
   * @params none
   * @returns honeyClient, honeyMarket, honeyUser, honeyReserves
  */
  const saberHqConnection = useConnection();
  const sdkWallet = useConnectedWallet();
  const { honeyClient, honeyMarket, honeyUser, honeyReserves } = useMarket(saberHqConnection, sdkWallet, 'GU7mDmGtLXNMo6YsF1FBsrXj2DqnrL82P4eMDKsDPnZZ');
 
  useEffect(() => {
    console.log(honeyClient, honeyMarket, honeyUser, honeyReserves);  
  }, [honeyClient, honeyMarket, honeyUser, honeyReserves]);

  /**
   * @description should be converted to new SDK implementation 
   * @params none
   * @returns modals 
  */
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [liveOrCompleted, setLiveOrCompleted] = useState(0);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const openLoanModal  = wallet && liveOrCompleted === 1
  const loadLoanPage = wallet && liveOrCompleted === 0

  function showLoanModal() {
    setModalIsVisible(true);
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
