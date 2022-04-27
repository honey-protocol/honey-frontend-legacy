import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text } from 'degen';
import Layout from '../../../components/Layout/Layout';
import LoanNFTsContainer from 'components/LoanNFTsContainer/LoanNFTsContainer';
import BorrowNFTsModule from 'components/BorrowNFTsModule/BorrowNFTsModule';
import useFetchNFTByUser from '../../../hooks/useNFTV2';
import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { useBorrowPositions, depositNFT, withdrawNFT, useMarket } from '@honey-finance/sdk';
import ConfigureSDK from '../../../helpers/config';
import Link from 'next/link';
import * as styles from '../../../styles/name.css';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

const marketNFTs = [
  {
    name: 'Cofre #529',
    image:'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    borrowApy: '4.2%',
    estValue: '$25,800',
    assetsBorrowed: 12000,
    netBorrowBalance: 13800,
    key: 1
  },
  {
    name: 'Sammy Wow',
    image:'https://www.arweave.net/Vw2M1pzgj8j5kDTtiUhLrZRocFsLcdOs0fZcLeD6yeY?ext=png',
    borrowApy: '8.1%',
    estValue: '$23,500',
    assetsBorrowed: 11000,
    netBorrowBalance: 0,
    tokenId: '9LZvVgGXjLQ3VH6simxE5RspmgA9kTNayTN8e7Y8dexq',
    key: 2
  },
  {
    name: 'Sammy Sponge',
    image:'https://www.arweave.net/qXTBbViM3_7KZ1DCcvZ7CEQ8sMh51e3L_j4Q0U7PBYU?ext=png',
    borrowApy: '4.2%',
    estValue: '$55,000',
    assetsBorrowed: 0,
    netBorrowBalance: 0,
    tokenId: 'D3NhaYYpYa8twQE6C6gfMLR6QajeTeV1LsHpg9R9FAtJ',
    key: 3
  },
];

const Loan: NextPage = (props) => {
  /**
   * @description loads sdk config object
   * @params none
   * @returns connection | wallet | honeyID | marketID
  */
  const sdkConfig = ConfigureSDK();
  
  /**
    * @description calls upon the honey sdk - market 
    * @params solanas useConnection func. && useConnectedWallet func. && JET ID
    * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyUser } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);
	
	useEffect(() => {
    console.log('the honeyUser;', honeyUser);
  }, [honeyUser]);
  /**
   * @description wip testing with fetching nft hook - for now no nfts in wallet
   * @params wallet
   * @returns array of nfts held by user in wallet
  */
  const wallet = useConnectedWallet();
  const availableNFTs = useFetchNFTByUser(wallet);

  const [selectedNFT, setSelection] = useState(0);
  /**
   * @description calls upon useBorrowPositions
   * @params connection && wallet && HONEY_PROGRAM_ID
   * @returns loading state | NFTs posted as collateral | loan positions | error
  */
  const { loading, collateralNFTPositions, loanPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

  /**
   * @TODO when loading state is true show loader in NFTs block
  */
  useEffect(() => {
    console.log("collateral nft positions ", collateralNFTPositions);
    console.log("loan positions: ", loanPositions);
    console.log('availableNFTs', availableNFTs)
    console.log('loading', loading)
  }, [collateralNFTPositions, loanPositions, availableNFTs, loading, selectedNFT])
  /**
   * @description this logic regards the selection of NFTs
   * @params NFT id
   * @returns NFT
  */
  const [selectedId, setSelectedId] = useState(1);

  function selectNFT(key: number) {
    console.log('----@@@-- this is the key', key)
    setSelection(key)
  };

	async function executeDepositNFT() {
    // mint of the NFT can be find on solscan
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "8Sfcn3XwQGA5phFMTmp71K3akzv9FS5bAAcoxredaa6y")
    depositNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

  async function executeWithdrawNFT() {
    const metadata = await Metadata.findByMint(sdkConfig.saberHqConnection, "3W3BUk69PBSDj1tqinjfjtmEAZL9oFyVzcYiS6JjPJYV");
    withdrawNFT(sdkConfig.saberHqConnection, honeyUser, metadata.pubkey);
  }

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
          buttons={[
            {
							title: 'WithdrawNFT',
						},
						{
							title: 'Deposit NFT',
						}
          ]}
        />
      </Box>
    </Layout>
  );
};

export default Loan;
