import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import * as styles from './LoanNFTsContainer.css';

type TButton = {
  title: string;
  hidden?: boolean;
};
interface LoanNFTsContainerProps {
  openPositions: any[],
  NFTs: any[],
  selectedId: number,
  onSelectNFT: (key: number) => void,
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

  const [renderState, handleRenderStateChange] = useState(0);

  function handleNewPosition(value: string) {
    console.log('handle new position', value)
    value == 'New position' ? handleRenderStateChange(1) : handleRenderStateChange(0);
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


