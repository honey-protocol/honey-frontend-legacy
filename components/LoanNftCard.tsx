import React, { useState, FC, ReactNode } from 'react';
import Image from 'next/image';
import { Avatar, Box } from 'degen';

interface LoanNFTCardProps {
  NFT: NFT;
  // onSelect: () => void;
  // isSelected: boolean;
  // onUnselect: () => void;
}

const LoanNFTCard = (props: LoanNFTCardProps) => {
  // const [selected, setSelected] = useState(false);

  // function selectNFT() {
  //   return (console.log(props.NFT.name))
  //  if (selected) {

  //  }
  }
  return (
    <Box
      backgroundColor={'backgroundSecondary'}
      borderRadius="3xLarge"
      borderWidth={props.NFT.name == 'SMB #2721' ? '0.5' : '0'}
      borderColor="accent"
      padding="1.5"
      overflow="hidden"
      // onClick={() => setSelected(true)}
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
