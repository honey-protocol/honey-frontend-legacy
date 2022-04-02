import React, { useState, FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';

interface LoanNFTCardProps {
  NFT: {
    name: string,
    image: string,
    key: number
  };
  selected: boolean;
  onSelect: (key: number) => void;
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  const {
    onSelect
  } = props;

  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.selected ? '0.5' : '0'}
      borderColor="accent"
      padding="1.5"
      overflow="hidden"
      onClick={() => onSelect(props.NFT.key)}
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
