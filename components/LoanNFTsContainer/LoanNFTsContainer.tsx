import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useState } from 'react';
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


  function handleNewPosition() {
    console.log('handle new position')
    handleRenderStateChange(0);
  }
  
  function handleOpenPositions() {
    console.log('handle open position')
    handleRenderStateChange(1);
  }

  console.log('NFT', openPositions, NFTs)

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Box height="full" display="flex">
          <Stack flex={1}>
            <Stack direction="horizontal" justify="space-between">
              <Text weight="semiBold" variant="large">
                {title}
              </Text>
              <Stack direction="horizontal" space="2">
                {buttons.map(button =>
                  button.hidden ? (
                    <></>
                  ) : (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={false}
                      onClick={handleNewPosition}
                    >
                      {button.title}
                    </Button>
                  )
                )}
              </Stack>
            </Stack>
              <Box className={styles.nftContainer}>
                { openPositions && openPositions.map((nft: any, i: number) => (
                  <LoanNFTCard
                    selected={nft.collateralTokenId === selectedId}
                    key={nft.tokenId}
                    NFT={nft}
                    onSelect={onSelectNFT}
                  />
                ))}
              </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default LoanNFTsContainer;


