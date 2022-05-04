import React, { useState, FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';
import * as styles from '../components/LoanNFTsContainer/LoanNFTsContainer.css';

interface LoanNFTCardProps {
  NFT: {
    name: string,
    image: string,
    key: number
  };
  selected: boolean;
  onSelect: (key: number) => void;
  available: boolean;
  executeWithdrawNFT: (nft: any) => void;
  executeDepositNFT: (nft: any) => void;
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  const {
    onSelect, available
  } = props;

  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.selected ? '0.5' : '0'}
      padding="1.5"
      overflow="hidden"
      onClick={() => onSelect(props.NFT, available)}
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
