import LoanNFTCard from '../LoanNftCard';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import * as styles from './LoanNFTsContainer.css';
import ConfigureSDK  from '../../helpers/config';
import { deposit, depositCollateral, depositNFT, HoneyUser, withdrawNFT } from '@honey-finance/sdk';
import { useMarket, usePools, useBorrowPositions, METADATA_PROGRAM_ID } from '@honey-finance/sdk';

type TButton = {
  title: string;
  hidden?: boolean;
};
interface LoanNFTsContainerProps {
  openPositions: any[],
  NFTs: any[],
  selectedId: number,
  onSelectNFT: (key: number) => void,
  executeDepositNFT?: () => void,
  hans?: () => void,
  title: string;
  buttons: TButton[];
}

const LoanNFTsContainer = (props: LoanNFTsContainerProps) => {
  const {
    openPositions,
    NFTs,
    title,
    buttons,
    selectedId,
    onSelectNFT,
  } = props;

  const sdkConfig = ConfigureSDK();

  const [renderState, handleRenderStateChange] = useState(0);

  function handleNewPosition(value: string) {
    console.log('handle new position', value)
    value == 'New position' ? handleRenderStateChange(1) : handleRenderStateChange(0);
  }

  useEffect(() => {}, [renderState])

  /**
   * @description calls upon the honey sdk - market 
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
   const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet, sdkConfig.honeyId, sdkConfig.marketID);

  async function executeDepositNFT() {
    // mint of the NFT can be find on solscan
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "8Sfcn3XwQGA5phFMTmp71K3akzv9FS5bAAcoxredaa6y")
    depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function executeWithdrawNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "3W3BUk69PBSDj1tqinjfjtmEAZL9oFyVzcYiS6JjPJYV");
    withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  useEffect(() => {console.log('use effect running', renderState)}, [renderState])

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Box height="full" display="flex">
          <Stack flex={1}>
            <Stack direction="horizontal" justify="space-between">
              <Text weight="semiBold" variant="large">
                {title}
              </Text>
              <Box className={styles.buttonSelectionWrapper}>
                  {buttons.map(button =>
                    button.hidden ? (
                      <></>
                    ) : (
                      <Button
                        key={button.title}
                        size="small"
                        disabled={false}
                        onClick={() => {handleNewPosition(button.title)}}
                      >
                        {button.title}
                      </Button>
                    )
                  )}
              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                { renderState == 0 && openPositions ?
                  openPositions.map((nft: any, i: number) => {
                    return (
                      <LoanNFTCard
                        selected={nft.collateralTokenId === selectedId}
                        key={nft.tokenId}
                        NFT={nft}
                        onSelect={onSelectNFT}
                        executeWithdrawNFT={executeWithdrawNFT}
                        isLocked={true}
                    />
                    )
                  }) : 
                  NFTs[0].map((nft: any, i: number) => {
                    return (
                      <LoanNFTCard 
                        selected={nft.tokenId || selectedId}
                        key={nft.tokenId}
                        NFT={nft}
                        onSelect={onSelectNFT}
                        isLocked={false}
                        executeDepositNFT={executeDepositNFT}
                    />
                    )
                  })
                }
              </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default LoanNFTsContainer;


