import type { NextPage } from 'next';
import { Box, Stack, Button, IconChevronLeft } from 'degen';
import Layout from '../../../components/Layout/Layout';
import FarmHeaderComponent from 'components/FarmHeaderComponent/FarmHeaderComponent';
import useGemFarm from 'hooks/useGemFarm';
import FarmNFTsContainer from 'components/FarmNFTsContainer/FarmNFTsContainer';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { useState } from 'react';

const Nft: NextPage = () => {
  const {
    onWalletNFTSelect,
    onWalletNFTSelectAll,
    onWalletNFTUnselect,
    onStakedNFTSelect,
    onStakedNFTSelectAll,
    onStakedNFTUnselect,
    initializeFarmerAcc,
    handleStakeButtonClick,
    handleUnstakeButtonClick,
    isFetching,
    stakedNFTsInFarm,
    walletNFTsInFarm,
    farmerAcc,
    selectedVaultNFTs,
    selectedWalletNFTs
  } = useGemFarm();

  const [txLoading, setTxLoading] = useState({
    value: false,
    txName: ''
  });

  const withTxLoading = async (tx: Function, txName: string) => {
    try {
      setTxLoading({ value: true, txName });
      await tx();
      setTxLoading({ value: false, txName: '' });
    } catch (error) {
      console.log(error);
      setTxLoading({ value: false, txName: '' });
    }
  };

  return (
    <Layout>
      <Box marginTop="3" marginBottom="2">
        <Stack
          direction={{ lg: 'horizontal', md: 'vertical' }}
          justify="space-between"
        >
          <Box
            marginRight="auto"
            display="flex"
            alignSelf="center"
            justifySelf="center"
            marginBottom="3"
          >
            <Link href="/farm" passHref>
              <Button
                size="small"
                variant="transparent"
                rel="noreferrer"
                prefix={<IconChevronLeft />}
              >
                Farms
              </Button>
            </Link>
          </Box>
          <FarmHeaderComponent />
        </Stack>
      </Box>
      <Box display="flex" height="full" className={styles.cardsContainer}>
        {/* User wallet NFT container */}
        <FarmNFTsContainer
          isFetching={isFetching}
          title="Select your NFTs"
          buttons={[
            {
              title: `Select All`,
              disabled: !farmerAcc
                ? false
                : Object.values(walletNFTsInFarm).length > 0
                ? false
                : true,
              onClick: () => onWalletNFTSelectAll()
            },
            {
              title: !farmerAcc
                ? 'Initialize'
                : `Stake ( ${selectedWalletNFTs.length} )`,
              disabled: !farmerAcc
                ? false
                : selectedWalletNFTs.length
                ? false
                : true,
              loading: txLoading.value && txLoading.txName === 'deposit',
              onClick: !farmerAcc
                ? () => withTxLoading(initializeFarmerAcc, 'deposit')
                : () => withTxLoading(handleStakeButtonClick, 'deposit')
            }
          ]}
          NFTs={Object.values(walletNFTsInFarm)}
          selectedNFTs={selectedWalletNFTs}
          onNFTSelect={onWalletNFTSelect}
          onNFTUnselect={onWalletNFTUnselect}
        />
        {/* Staked in Vault NFT container */}
        <FarmNFTsContainer
          isFetching={isFetching}
          title="Your vault"
          buttons={[
            {
              title: `Select All`,
              disabled: Object.values(stakedNFTsInFarm).length < 1,
              onClick: () => onStakedNFTSelectAll()
            },
            {
              title: `Unstake (${selectedVaultNFTs.length})`,
              disabled: !selectedVaultNFTs.length,
              loading: txLoading.value && txLoading.txName === 'vault',
              onClick: () => withTxLoading(handleUnstakeButtonClick, 'vault')
            }
          ]}
          NFTs={Object.values(stakedNFTsInFarm)}
          selectedNFTs={selectedVaultNFTs}
          onNFTSelect={onStakedNFTSelect}
          onNFTUnselect={onStakedNFTUnselect}
        />
      </Box>
    </Layout>
  );
};

export default Nft;
