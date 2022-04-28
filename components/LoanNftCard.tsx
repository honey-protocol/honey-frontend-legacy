import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';
import * as styles from '../components/LoanNFTsContainer/LoanNFTsContainer.css';

interface LoanNFTCardProps {
  NFT: {
    name: string,
    image: string,
    key: number,
  };
  selected: boolean;
  onSelect: (key: number) => void,
  isLocked: boolean,
  executeWithdrawNFT?: () => void,
  executeDepositNFT?: () => void,
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  const {
    onSelect,
    NFT
  } = props;

  function handleClick(nft: any) {
    onSelect(nft)
  }  

  return (
    <Box
      className={styles.nftWrapper}
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.selected ? '0.5' : '0'}
      padding="1.5"
      overflow="hidden"
      onClick={() => {
        handleClick(props.NFT)
      }}
    >
      <Avatar
        label={props.NFT.name}
        size="full"
        src={props.NFT.image}
        shape="square"
        key={props.NFT.key}
      />
    </Box>
  );
};

export default LoanNFTCard;
