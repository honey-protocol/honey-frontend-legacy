import HeadSeo from 'components/HeadSeo/HeadSeo';
import siteMetadata from 'constants/siteMetadata';
import type { NextPage } from 'next';
import { Box, Stack, Button, IconChevronLeft } from 'degen';
import Layout from '../../../components/Layout/Layout';
import FarmHeaderComponent from 'components/FarmHeaderComponent/FarmHeaderComponent';
import useGemFarm from 'hooks/useGemFarm';
import FarmNFTsContainer from 'components/FarmNFTsContainer/FarmNFTsContainer';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useGemFarmStaking from "../../../hooks/useGemFarmStaking"

const Nft: NextPage = () => {
  const [farmId, setFarmId] = useState(process.env.NEXT_PUBLIC_GEMFARM_ID || "")

  const {
    walletNFTs,
    farmerAccount,
    farmerVaultAccount,
    farmerStatus,
    selectedWalletItems,
    isLocked,
    availableA,
    feedbackStatus,
    handleStakeButtonClick,
    handleUnstakeButtonClick,
    handleClaimButtonClick,
    handleWalletItemClick,
    handleMoveToVaultButtonClick,
    farmerVaultNFTs,
    selectedVaultItems,
    handleMoveToWalletButtonClick,
    handleVaultItemClick,
    handleInitStakingButtonClick,
    handleRefreshRewardsButtonClick,
  } = useGemFarmStaking(farmId)

  const {
    onWalletNFTSelect,
    onWalletNFTSelectAll,
    onWalletNFTUnselect,
    onStakedNFTSelect,
    onStakedNFTSelectAll,
    onStakedNFTUnselect,
    initializeFarmerAcc,
    // handleStakeButtonClick,
    // handleUnstakeButtonClick,
    isFetching,
    stakedNFTsInFarm,
    walletNFTsInFarm,
    farmerAcc,
    selectedVaultNFTs,
    selectedWalletNFTs,
    farmerState,
    farmerVaultLocked,
    rewardTokenName,
    lockVault
  } = useGemFarm();

  const router = useRouter();
  const { name } = router.query;
  console.log('Page Id ' + name);

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
      <HeadSeo
        title={`${name} | Farms | ${siteMetadata.companyName}`}
        description={`Start staking your ${name} NFT to earn ${rewardTokenName} token in Solana.`}
        canonicalUrl={siteMetadata.siteUrl}
        ogImageUrl={'https://app.honey.finance/honey-og-image.png'}
        ogTwitterImage={siteMetadata.siteLogoSquare}
        ogType={'website'}
      />

      <Box marginTop="3" marginBottom="2">
        <Stack
          direction={{ lg: 'horizontal', xs: 'vertical' }}
          justify="space-between"
          wrap
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
          <FarmHeaderComponent
            farmerState={farmerState}
            stakedNFTsInFarm={stakedNFTsInFarm}
            farmerVaultLocked={farmerVaultLocked}
            lockVault={lockVault}
          />
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
              disabled: !farmerAccount
                ? false
                : Object.values(walletNFTsInFarm).length > 0
                ? false
                : true,
              onClick: () => onWalletNFTSelectAll()
            },
            {
              title: !farmerAccount
                ? 'Initialize'
                : `Stake ( ${selectedWalletNFTs.length} )`,
              disabled: !farmerAccount
                ? false
                : selectedWalletNFTs.length
                ? false
                : true,
              loading: txLoading.value && txLoading.txName === 'deposit',
              onClick: !farmerAccount
                ? () => withTxLoading(initializeFarmerAcc, 'deposit')
                : () => withTxLoading(handleStakeButtonClick, 'deposit')
            }
          ]}
          NFTs={walletNFTs}
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
          NFTs={farmerVaultNFTs}
          selectedNFTs={selectedVaultNFTs}
          onNFTSelect={onStakedNFTSelect}
          onNFTUnselect={onStakedNFTUnselect}
        />
      </Box>
    </Layout>
  );
};

export default Nft;
