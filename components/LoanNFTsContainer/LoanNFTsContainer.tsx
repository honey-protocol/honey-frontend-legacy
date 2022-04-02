import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React from 'react';
import * as styles from './LoanNFTsContainer.css';

type TButton = {
  title: string;
  hidden?: boolean;
};
interface LoanNFTsContainerProps {
  NFTs: any[];
  selectedId: number,
  onSelectNFT: (key: number) => void,
  title: string;
  buttons: TButton[];
}

const LoanNFTsContainer = (props: LoanNFTsContainerProps) => {
  const {
    NFTs,
    title,
    buttons,
    selectedId,
    onSelectNFT,
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
              <Stack direction="horizontal" space="2">
                {buttons.map(button =>
                  button.hidden ? (
                    <></>
                  ) : (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={true}
                    >
                      {button.title}
                    </Button>
                  )
                )}
              </Stack>
            </Stack>
              <Box className={styles.nftContainer}>
                {NFTs.map((nft, i) => (
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


