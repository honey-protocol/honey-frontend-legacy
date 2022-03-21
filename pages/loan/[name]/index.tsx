import type { NextPage } from 'next';
import { Box, Stack, Button, IconRefresh, IconChevronLeft } from 'degen';
import Layout from '../../../components/Layout/Layout';
import useGemFarm from 'hooks/useGemFarm';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';

const Loan: NextPage = () => {
  const {
    depositMoreSelectedGems,
    claimRewards,
    endStaking,
    startStaking,
    withdrawSelectedGems,
    depositSelectedGems,
    initializeFarmerAcc,
    refreshWithLoadingIcon,
    onWalletNFTSelect,
    onWalletNFTUnselect,
    onStakedNFTSelect,
    onStakedNFTUnselect,
    isFetching,
    stakedNFTsInFarm,
    walletNFTsInFarm,
    farmerAcc,
    farmerState,
    selectedVaultNFTs,
    selectedWalletNFTs,
    farmerVaultLocked
  } = useGemFarm();

  return (
    <Layout>
      <Box marginY="4">
        <Stack
          direction="horizontal"
          justify="space-between"
          wrap
          align="center"
        >
          <Box display="flex" alignSelf="center" justifySelf="center">
            <Link href="/loan" passHref>
              <Button
                size="small"
                variant="transparent"
                rel="noreferrer"
                prefix={<IconChevronLeft />}
              >
                Pools
              </Button>
            </Link>
          </Box>
        </Stack>
      </Box>
      <Box display="flex" height="full" className={styles.cardsContainer}>
        <LoanNFTsContainer
          isFetching={isFetching}
          title="Open positions"
          buttons={[
            {
              title: 'New position',
              disabled: selectedWalletNFTs.length ? false : true,
              onClick: !farmerAcc
                ? initializeFarmerAcc
                : !farmerVaultLocked
                ? depositSelectedGems
                : depositMoreSelectedGems
            }
          ]}
          NFTs={Object.values(walletNFTsInFarm)}
          selectedNFTs={selectedWalletNFTs}
          onNFTSelect={onWalletNFTSelect}
          onNFTUnselect={onWalletNFTUnselect}
        />
        <BorrowNFTsModule
          isFetching={isFetching}
          title=""
          buttons={[
            {
              title: `Borrow`,
              disabled: !selectedVaultNFTs.length,
              hidden: farmerVaultLocked,
              onClick: withdrawSelectedGems
            },
            {
              title: 'Repay',
              disabled: Object.values(stakedNFTsInFarm).length ? false : true,
              onClick: farmerVaultLocked ? endStaking : startStaking
            }
          ]}
          NFTs={Object.values(stakedNFTsInFarm)}
          selectedNFTs={selectedVaultNFTs}
          onNFTSelect={!farmerVaultLocked ? onStakedNFTSelect : null}
          onNFTUnselect={onStakedNFTUnselect}
        />
      </Box>
    </Layout>
  );
};

export default Loan;
