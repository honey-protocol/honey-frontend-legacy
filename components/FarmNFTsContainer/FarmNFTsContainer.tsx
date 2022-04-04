import FarmNFTCard from 'components/FarmNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React from 'react';
import * as styles from './FarmNFTsContainer.css';

type TButton = {
  title: string;
  disabled: boolean;
  loading?: boolean;
  hidden?: boolean;
  onClick: () => void;
};
interface FarmNFTsContainerProps {
  isFetching: boolean;
  NFTs: NFT[];
  selectedNFTs: NFT[];
  title: string;
  buttons: TButton[];
  onNFTSelect: Function | null;
  onNFTUnselect: (NFT: NFT) => void;
}

const FarmNFTsContainer = (props: FarmNFTsContainerProps) => {
  const {
    NFTs,
    selectedNFTs,
    title,
    buttons,
    onNFTSelect,
    onNFTUnselect,
    isFetching
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
                      disabled={button.disabled}
                      loading={button.loading}
                      onClick={button.onClick}
                    >
                      {button.title}
                    </Button>
                  )
                )}
              </Stack>
            </Stack>
            {isFetching ? (
              <Box className={styles.centerItemContainer}>
                <Spinner size="large" />
              </Box>
            ) : !NFTs.length ? (
              <Box className={styles.centerItemContainer}>
                <Text>No NFTs to display</Text>
              </Box>
            ) : (
              <Box className={styles.nftContainer}>
                {NFTs.map((nft, i) => (
                  <FarmNFTCard
                    key={nft.mint}
                    NFT={nft}
                    onSelect={onNFTSelect ? () => onNFTSelect(nft) : () => {}}
                    onUnselect={() => onNFTUnselect(nft)}
                    isSelected={Boolean(
                      selectedNFTs.find(
                        (NFT: NFT) => nft.tokenId === NFT.tokenId
                      )
                    )}
                  />
                ))}
              </Box>
            )}
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default FarmNFTsContainer;
