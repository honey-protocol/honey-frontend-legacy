import type { NextPage } from 'next';
import { Box, Stack, Button, IconRefresh, IconChevronLeft } from 'degen';
import Layout from '../../../components/Layout/Layout';
import useGemFarm from 'hooks/useGemFarm';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';

const marketNFTs = [
  {
    name: 'SMB #2721',
    image:'/nfts/2721.png',
    borrowApy: '4.2%',
    estValue: '$25,800',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 1
  },
  {
    name: 'SMB #273',
    image:'/nfts/273.png',
    borrowApy: '4.2%',
    estValue: '$23,500',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 2
  },
  {
    name: 'SMB #1912',
    image:'/nfts/1912.png',
    borrowApy: '4.2%',
    estValue: '$55,000',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 3
  },
  {
    name: 'SMB #2738',
    image:'/nfts/2738.png',
    borrowApy: '4.2%',
    estValue: '$33,300',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 4
  },
  {
    name: 'SMB #3956',
    image:'/nfts/3956.png',
    borrowApy: '4.2%',
    estValue: '$39,500',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    key: 5
  },
]

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
          NFTs={marketNFTs}
          // selectedNFTs={selectedWalletNFTs}
          // onNFTSelect={onWalletNFTSelect}
          // onNFTUnselect={onWalletNFTUnselect}
        />
        <BorrowNFTsModule />
      </Box>
    </Layout>
  );
};

export default Loan;
