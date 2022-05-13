import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useState, useEffect } from 'react';
import * as styles from './LoanNFTsContainer.css';

type TButton = {
  title: string;
  active?: boolean;
};
interface LoanNFTsContainerProps {
  NFTs?: any[];
  selectedId: any;
  onSelectNFT: (key: any, available: boolean) => void;
  title?: string;
  buttons: TButton[];
  openPositions: any;
  availableNFTs: any[];
  handleBorrow: (key: number) => void;
  executeWithdrawNFT: (nft: any) => void;
  executeDepositNFT: (nft: any) => void;
  nftArrayType: any;
}

const LoanNFTsContainer = (props: LoanNFTsContainerProps) => {
  const {
    title,
    buttons,
    selectedId,
    onSelectNFT,
    availableNFTs,
    handleBorrow,
    executeWithdrawNFT,
    executeDepositNFT,
    openPositions,
    nftArrayType
  } = props;

  const placeholderNFTObject = {
    selected: '',
    key: '',
    NFT: '',
    onSelectNFT: '',
    available: false,
    executeDepositNFT: () => {},
    handleActiveState: () => {},
    activeNFT: ''
  }

  /**
   * @description based off renderNFTs either open positions (0) gets rendered or available nfts (1)
   * @params 0 or 1
   * @returns the appropriate array to render in the borrow module
  */
  const [renderNFTs, setRenderNFTs] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  /**
   * @description
   * this logic is to determine the active state of selected NFT
   * @params nft name and positiontype being open or available
   * @returns re-renders component nft with active state
  */
  const [highlightNFTOpen, setHighlightNFTOpen] = useState(0);
  const [highlightNFTAvailable, setHighlightNFTAvailable] = useState(0);

  function handleActiveState(nft: any, positionType: string) {
    if (positionType == 'open') {
      setHighlightNFTOpen(nft)
    } else {
      setHighlightNFTAvailable(nft)
    }
  }

  console.log('this is open positions', openPositions)

  useEffect(() => {
  }, [highlightNFTOpen, highlightNFTAvailable]);

  /**
   * @description handler for above declared logic
   * @params title of the button thats being clicked; open positions || new position
   * @returns nothing - sets state of to be rendered nft array
  */
  function handleNFTModal(nftType: string) {
    if (nftType == 'Open positions') {
      setRenderNFTs(0);
      handleBorrow(1);
      setActiveIndex(0);
    } else {
      setRenderNFTs(1);
      handleBorrow(0);
      setActiveIndex(1);
    }
  }
  // re-render after update
  useEffect(() => {
  }, [renderNFTs]);

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
                {buttons.map((button, i) =>
                   (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={button.title == 'Open positions' && openPositions?.length < 1 ? true : false}
                      onClick={() => handleNFTModal(button.title)}
                      variant={i === activeIndex ? 'primary' : 'secondary'}
                    >
                      {button.title}
                    </Button>
                ))}
              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                {
                  openPositions && openPositions.length > 0 && renderNFTs == 0 ? openPositions.map((nft: any, i: any) => (
                    <LoanNFTCard
                      selected={selectedId}
                      key={nft.key}
                      NFT={nft}
                      onSelectNFT={onSelectNFT}
                      available={false}
                      executeWithdrawNFT={executeWithdrawNFT}
                      handleActiveState={handleActiveState}
                      activeNFT={highlightNFTOpen}
                      nftArrayType={nftArrayType}
                    />
                  )) : availableNFTs && availableNFTs.map((nft, i) => (
                    <LoanNFTCard
                      selected={selectedId}
                      key={nft.key}
                      NFT={nft}
                      onSelectNFT={onSelectNFT}
                      available={true}
                      executeDepositNFT={executeDepositNFT}
                      handleActiveState={handleActiveState}
                      activeNFT={highlightNFTAvailable}
                      nftArrayType={nftArrayType}
                    />
                  ))
                }
              </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default LoanNFTsContainer;


