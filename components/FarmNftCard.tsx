import React, { FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';
import { NFT } from '@/hooks/useWalletNFTs';

interface FarmNFTCardProps {
  NFT: NFT;
  onSelect: () => void;
  isSelected: boolean;
  onUnselect: () => void;
}

const FarmNFTCard = (props: FarmNFTCardProps) => {
  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.isSelected ? '0.5' : '0'}
      borderColor="accent"
      padding="1.5"
      overflow="hidden"
      onClick={
        !props.isSelected ? () => props.onSelect() : () => props.onUnselect()
      }
    >
      <Avatar
        label={props.NFT.externalMetadata.name}
        size="full"
        src={props.NFT.externalMetadata.image}
        shape="square"
        // key={props.NFT.mint}
      />
    </Box>
  );
};

export default FarmNFTCard;
