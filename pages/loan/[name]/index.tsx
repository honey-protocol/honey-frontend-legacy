import type { NextPage } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import useFetchNFTByUser from '../../../hooks/useNFTV2';
import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { useBorrowPositions, depositNFT, withdrawNFT, useMarket, borrow, repay } from '@honey-finance/sdk';
import ConfigureSDK from '../../../helpers/config';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';


const Loan: NextPage = (props) => {
  /**
   * @description loads sdk config object
   * @params none
   * @returns connection | wallet | honeyID | marketID
  */
  const sdkConfig = ConfigureSDK();

  const [borrowB, setBorrowB] = useState(1);


  const marketNFTs = [
    {
      name: 'Cofre #529',
      image:'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
      borrowApy: '1%',
      estValue: '$100',
      assetsBorrowed: borrowB,
      netBorrowBalance: borrowB,
      key: 1
    }
  ];
  
  function updateBorrow(value:number) {
    setBorrowB(value)
  }

  useEffect(() => {}, [borrowB]);
  /**
    * @description calls upon the honey sdk - market 
    * @params solanas useConnection func. && useConnectedWallet func. && JET ID
    * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);
	useEffect(() => {
    
  }, [honeyUser])

  /**
   * @description wip testing with fetching nft hook - for now no nfts in wallet
   * @params wallet
   * @returns array of nfts held by user in wallet
  */
  const wallet = useConnectedWallet();
  let availableNFTs = useFetchNFTByUser(wallet);

  const [selectedNFT, setSelection] = useState(0);
  /**
   * @description calls upon useBorrowPositions
   * @params connection && wallet && HONEY_PROGRAM_ID
   * @returns loading state | NFTs posted as collateral | loan positions | error
  */
  let { loading, collateralNFTPositions, loanPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  /**
   * @TODO when loading state is true show loader in NFTs block
  */
  useEffect(() => {
    console.log("----collateral nft positions ", collateralNFTPositions);
    console.log("loan positions: ", loanPositions);
    console.log('change')
  }, [collateralNFTPositions, loanPositions, availableNFTs, loading, selectedNFT])
  /**
   * @description this logic regards the selection of NFTs
   * @params NFT id
   * @returns NFT
  */
  const [selectedId, setSelectedId] = useState(1);

  async function executeBorrow() {
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, 1 * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);
  }

  async function executeRepay() {
    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, 1 * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
    console.log(tx);
  }


  function selectNFT(key: number) {
    setSelection(key)
  };

  collateralNFTPositions?.map(async (item) => {
    let x = await Metadata.findByMint(sdkConfig.saberHqConnection, item.mint)
  })

  return (
    <Layout>
      <Box marginY="4">
        <Stack
          direction="horizontal"
          justify="space-between"
          wrap
          align="center"
        > 
          <Box display="flex" alignSelf="center" justifySelf="center">
            <Link href="/loan" passHref>
              <Button
                size="small"
                variant="transparent"
                rel="noreferrer"
                prefix={<IconChevronLeft />}
              >
                Pools
              </Button>
            </Link>
          </Box>
        </Stack>
      </Box>
      <Box display="flex" height="full" className={styles.loanCardsContainer}>
        <LoanNFTsContainer
          // title="Open positions"
          selectedId={selectedNFT || 0}
          buttons={[
            {
              title: 'Open position'
            },
            {
              title: 'Withdraw NFT'
            },
            {
              title: 'New position',
            },
            {
              title: 'Deposit NFT',
            }
          ]}
          openPositions={collateralNFTPositions}
          NFTs={availableNFTs}
          connection={sdkConfig.saberHqConnection}
          honeyUser={honeyUser}
          onSelectNFT={selectNFT}
        />
        <BorrowNFTsModule
          NFT={marketNFTs.find((NFT) => NFT.key === selectedId) || marketNFTs[0]}
          handleBorrow={updateBorrow} 
          loanPositions={loanPositions}
        />
      </Box>
    </Layout>
  );
};

export default Loan;
