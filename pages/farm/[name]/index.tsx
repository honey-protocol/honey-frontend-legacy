import type { NextPage } from 'next';
import {
  Box,
  Stack,
  Button,
  IconRefresh,
  IconChevronLeft,
  Heading
} from 'degen';
import Layout from '../../../components/Layout/Layout';
import FarmHeaderComponent from 'components/FarmHeaderComponent/FarmHeaderComponent';
import useGemFarm from 'hooks/useGemFarm';
import FarmNFTsContainer from 'components/FarmNFTsContainer/FarmNFTsContainer';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Nft: NextPage = () => {
  const {
    depositMoreSelectedGems,
    endStaking,
    startStaking,
    withdrawSelectedGems,
    depositSelectedGems,
    initializeFarmerAcc,
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

  const router = useRouter();
  const collectionName = router.query.name;

  const [txLoading, setTxLoading] = useState({
    value: false,
    txName: ''
  });

  const withTxLoading = async (tx: Function, txName: string) => {
    setTxLoading({ value: true, txName });
    await tx();
    setTxLoading({ value: false, txName: '' });
  };

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
          <Heading level="2">{collectionName}</Heading>
          <FarmHeaderComponent name={collectionName}/>
        </Stack>
      </Box>
      <Box display="flex" height="full" className={styles.cardsContainer}>
        <FarmNFTsContainer
          isFetching={isFetching}
          title="Select your NFTs"
          buttons={[
            {
              title: !farmerAcc
                ? 'Initialize'
                : !farmerVaultLocked
                ? `Deposit ( ${selectedWalletNFTs.length} )`
                : `Deposit  (${selectedWalletNFTs.length}) more`,
              disabled: selectedWalletNFTs.length ? false : true,
              loading: txLoading.value && txLoading.txName === 'deposit',
              onClick: !farmerAcc
                ? () => withTxLoading(initializeFarmerAcc, 'deposit')
                : !farmerVaultLocked
                ? () => withTxLoading(depositSelectedGems, 'deposit')
                : () => withTxLoading(depositMoreSelectedGems, 'deposit')
            }
          ]}
          NFTs={Object.values(walletNFTsInFarm)}
          selectedNFTs={selectedWalletNFTs}
          onNFTSelect={onWalletNFTSelect}
          onNFTUnselect={onWalletNFTUnselect}
        />
        <FarmNFTsContainer
          isFetching={isFetching}
          title="Your vault"
          buttons={[
            {
              title: `Withdraw (${selectedVaultNFTs.length})`,
              disabled: !selectedVaultNFTs.length,
              hidden: farmerVaultLocked,
              loading: txLoading.value && txLoading.txName === 'withdraw',
              onClick: () => withTxLoading(withdrawSelectedGems, 'withdraw')
            },
            {
              title: farmerVaultLocked
                ? farmerState === 'pendingCooldown'
                  ? 'End cooldown'
                  : 'Unlock'
                : `Start rewards`,
              disabled: Object.values(stakedNFTsInFarm).length ? false : true,
              loading: txLoading.value && txLoading.txName === 'vault',
              onClick: farmerVaultLocked
                ? () => withTxLoading(endStaking, 'vault')
                : () => withTxLoading(startStaking, 'vault')
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

export default Nft;
