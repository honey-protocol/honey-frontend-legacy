import type { NextPage } from 'next';
import { Box, Stack, Button, IconRefresh, IconChevronLeft } from 'degen';
import Layout from '../../../components/Layout/Layout';
import useGemFarm from 'hooks/useGemFarm';
import FarmNFTsContainer from 'components/FarmNFTsContainer/FarmNFTsContainer';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';

const Nft: NextPage = () => {
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
          <Stack space="3" direction="horizontal">
            <Box>
              <Button
                onClick={refreshWithLoadingIcon}
                variant="secondary"
                shape="square"
                size="small"
              >
                <IconRefresh />
              </Button>
            </Box>

            <Button onClick={claimRewards} size="small">
              Claim rewards
            </Button>
          </Stack>
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
        <FarmNFTsContainer
          isFetching={isFetching}
          title="Your vault"
          buttons={[
            {
              title: `Withdraw (${selectedVaultNFTs.length})`,
              disabled: !selectedVaultNFTs.length,
              hidden: farmerVaultLocked,
              onClick: withdrawSelectedGems
            },
            {
              title: farmerVaultLocked
                ? farmerState === 'pendingCooldown'
                  ? 'End cooldown'
                  : 'Unlock'
                : `Start rewards`,
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

export default Nft;
