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
  executeDepositNFT: () => void,
  executeWithdrawNFT?: () => void,
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
    // executeWithdrawNFT,
    executeDepositNFT
  } = props;

  const sdkConfig = ConfigureSDK();

  /**
   * @description calls upon the honey sdk - market 
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
   const { honeyUser } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  const [renderState, handleRenderStateChange] = useState('open');
  // EQPFwVdLg2XEiz7XEH8h7UBPqNPjosWWSkzb7aahjFAU
  
  async function executeWithdrawNFT(mint:any) {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, mint);
    withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function handleNewPosition(value: string) {
    if (value == 'New position') {
      handleRenderStateChange('new')
    } else if (value == 'Open position') {
      handleRenderStateChange('open')
    }

    if (value == 'Withdraw NFT') {
      let decodedNFT = await Metadata.findByMint(sdkConfig.saberHqConnection, selectedId.mint)
      executeWithdrawNFT(decodedNFT.data.mint)
    }

    if (value == 'Deposit NFT' && selectedId.tokenMetaPublicKey) {
      depositNFT(sdkConfig.saberHqConnection, honeyUser, selectedId.tokenMetaPublicKey)
    }
  }

  useEffect(() => {}, [renderState, selectedId])

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Box height="full" display="flex">
          <Stack flex={1}>
            <Stack direction="horizontal" justify="space-between">
              <Text weight="semiBold" variant="large">
                {title}
              </Text>
              {/* temp logic for rendering out buttons  */}
              <Box className={styles.buttonSelectionWrapper}>
                  {buttons.map((button) => {
                    if (button.title.includes('NFT')) {
                      if (button.title == 'Withdraw NFT' && renderState == 'open' && selectedId != 0) {
                        return (
                          <Button
                            key={button.title}
                            size="small"
                            disabled={false}
                            onClick={() => {handleNewPosition(button.title)}}
                          >
                            {button.title}
                          </Button>
                        )
                      } else if (button.title == 'Deposit NFT' && renderState == 'new' && selectedId != 0) {
                          return (
                            <Button
                              key={button.title}
                              size="small"
                              disabled={false}
                              onClick={() => {handleNewPosition(button.title)}}
                            >
                              {button.title}
                            </Button>
                          )
                        } else {
                          return (
                            <Button
                              key={button.title}
                              size="small"
                              disabled={true}
                              onClick={() => {handleNewPosition(button.title)}}
                            >
                              {button.title}
                            </Button>
                          )
                        }
                  } else {
                    return (
                      <Button
                        key={button.title}
                        size="small"
                        disabled={false}
                        onClick={() => {handleNewPosition(button.title)}}
                      >
                        {button.title}
                      </Button>
                    )
                  }
                  })}

              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                { (renderState == 'open' && openPositions) ?
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


