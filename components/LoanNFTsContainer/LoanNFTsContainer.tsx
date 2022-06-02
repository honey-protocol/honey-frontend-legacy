import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useState, useEffect } from 'react';
import * as styles from './LoanNFTsContainer.css';
import {NEW_POSITIONS, OPEN_POSITIONS, TYPE_OPEN, TYPE_PRIMARY, TYPE_SECONDARY, TYPE_ZERO, TYPE_ONE} from '../../constants/loan';
import { useConnectedWallet } from '@saberhq/use-solana';
import useFetchNFTByUser from '../../hooks/useNFTV2';

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
  reFetchNFTs: (val: any) => void;
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
    nftArrayType,
    reFetchNFTs
  } = props;

  /**
   * @description based off renderNFTs either open positions (0) gets rendered or available nfts (1)
   * @params 0 or 1
   * @returns the appropriate array to render in the borrow module
  */
  const [renderNFTs, setRenderNFTs] = useState(TYPE_ZERO);
  const [activeIndex, setActiveIndex] = useState(TYPE_ONE);
  
  /**
   * @description
   * this logic is to determine the active state of selected NFT
   * @params nft name and positiontype being open or available
   * @returns re-renders component nft with active state
  */
  const [highlightNFTOpen, setHighlightNFTOpen] = useState(TYPE_ZERO);
  const [highlightNFTAvailable, setHighlightNFTAvailable] = useState(TYPE_ZERO);

  useEffect(() => {
    if (openPositions?.length) setActiveIndex(TYPE_ZERO);
  }, [openPositions])

  /**
   * @description sets active state on NFT
   * @params nft | positionstype; open || available
   * @returns highlightNFTAvailable
  */
  function handleActiveState(nft: any, positionType: string) {
    if (positionType == TYPE_OPEN) {
      setHighlightNFTOpen(nft)
    } else {
      setHighlightNFTAvailable(nft)
    }
  }

  /**
   * @description handler for above declared logic
   * @params title of the button thats being clicked; open positions || new position
   * @returns nothing - sets state of to be rendered nft array
  */
     function handleNFTModal(nftType: string) {
      reFetchNFTs({});
      if (nftType == OPEN_POSITIONS) {
        setRenderNFTs(TYPE_ZERO);
        handleBorrow(TYPE_ONE);
        setActiveIndex(TYPE_ZERO);
      } else {
        setRenderNFTs(TYPE_ONE);
        handleBorrow(TYPE_ZERO);
        setActiveIndex(TYPE_ONE);
      }
    }

  /**
   * @description updates highlightNFTOpen | highlightNFTAvailable
   * @params none
   * @returns highlightNFTOpen | highlightNFTAvailable
  */
  useEffect(() => {
  }, [highlightNFTOpen, highlightNFTAvailable]);

  // re-render after update
  useEffect(() => {
  }, [renderNFTs]);

  useEffect(() => {
  }, [activeIndex]);

  useEffect(() => {
    console.log('__UPDATE_OPEN_POSITIONS', openPositions);
  }, [openPositions])

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
                {buttons.map((button, i) => {
                  return (
                    <Button
                    key={button.title}
                    size="small"
                    disabled={false}
                    onClick={() => handleNFTModal(button.title)}
                    variant={i === activeIndex ? TYPE_PRIMARY : TYPE_SECONDARY}
                  >
                    {button.title}
                  </Button>
                  )
                })}
              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                {
                  openPositions && openPositions.length > TYPE_ZERO && renderNFTs == TYPE_ZERO ? openPositions.map((nft: any, i: any) => (
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


