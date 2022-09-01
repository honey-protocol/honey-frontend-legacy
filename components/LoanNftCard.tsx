import React, { useState, useEffect, FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';
import * as styles from '../components/LoanNFTsContainer/LoanNFTsContainer.css';
import {TYPE_OPEN, TYPE_CLOSED} from '../constants/loan';

interface LoanNFTCardProps {
  NFT: {
    name: string,
    image: any,
    key: number
  };
  selected: any;
  onSelectNFT: (key: any, available: boolean) => void;
  available: boolean;
  executeWithdrawNFT?: (nft: any) => void;
  executeDepositNFT?: (nft: any) => void;
  handleActiveState: (nft: any, type: string) => void;
  activeNFT: any;
  nftArrayType: any;
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  let {
    onSelectNFT, available, handleActiveState, activeNFT, NFT, nftArrayType
  } = props;

  /**
   * @description sets state of active card by default to false
   * @params boolean
   * @returns activeCard
  */
  const [activeCard, setActiveCard] = useState(false);
  
  /**
   * @description handler that calls upon active state for modal and nft selection
   * @params nft name and type: open || closed
   * @returns sets state of highlighted NFT
  */
  function setActiveNFTState(name: string , type: string) {
    handleActiveState(name, type);
    onSelectNFT(NFT, available);
    activeCard ==  true ? setActiveCard(true) : setActiveCard(false);
  }

  useEffect(() => {
    if (props && available == false) setActiveNFTState(props.NFT.name, TYPE_OPEN);
  }, [props]);

  /**
   * @description updates activeCard 
   * @params none
   * @returns activeCard
  */
  useEffect(() => {
  }, [activeCard]);

  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.selected ? '0.5' : '0'}
      padding="1.5"
      overflow="hidden"
      onClick={() => setActiveNFTState(props.NFT.name, (available == false ? TYPE_OPEN : TYPE_CLOSED))}
      className={activeNFT == props.NFT.name ? styles.active : styles.notActive}
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
