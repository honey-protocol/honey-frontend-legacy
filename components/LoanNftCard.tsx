import React, { useState, useEffect, FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';
import * as styles from '../components/LoanNFTsContainer/LoanNFTsContainer.css';

interface LoanNFTCardProps {
  NFT: {
    name: string,
    image: string,
    key: number
  };
  selected: string;
  onSelect: (key: number, available: boolean) => void;
  available: boolean;
  executeWithdrawNFT: (nft: any) => void;
  executeDepositNFT: (nft: any) => void;
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  let {
    onSelect, available, selected
  } = props;

  const [activeCard, setActiveCard] = useState(false);

  function testing() {
    activeCard ==  true ? setActiveCard(false) : setActiveCard(true);
    onSelect(props.NFT, available)
  }

  useEffect(() => {

  }, [activeCard])

  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.selected ? '0.5' : '0'}
      padding="1.5"
      overflow="hidden"
      onClick={testing}
      className={activeCard == true ? styles.active : styles.notActive}
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
