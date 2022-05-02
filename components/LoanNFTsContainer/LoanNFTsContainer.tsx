import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, {useState} from 'react';
import * as styles from './LoanNFTsContainer.css';

type TButton = {
  title: string;
  active?: boolean;
};
interface LoanNFTsContainerProps {
  NFTs: any[];
  selectedId: number,
  onSelectNFT: (key: number) => void,
  title: string;
  buttons: TButton[];
  openPositions: any[];
  availableNFTs: any[]
}

const LoanNFTsContainer = (props: LoanNFTsContainerProps) => {
  const {
    title,
    buttons,
    selectedId,
    onSelectNFT,
    openPositions,
    availableNFTs
  } = props;

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
                  !button.active ? (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={false}
                    >
                      {button.title}
                    </Button>
                  ) : (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={false}
                    >
                      {button.title}
                    </Button>
                  )
                )}
              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                {openPositions && openPositions.map((nft, i) => (
                  <LoanNFTCard
                    selected={nft.key === selectedId}
                    key={nft.key}
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


