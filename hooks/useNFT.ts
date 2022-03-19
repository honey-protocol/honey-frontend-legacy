import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner
} from '@nfteyez/sol-rayz';
import { ConnectedWallet, useSolana } from '@saberhq/use-solana';
import { programs } from '@metaplex/js';

//this function should fetch all NFT from User
export default function useFetchNFTByUser(
  wallet: ConnectedWallet | null
): [Array<NFT>, Function, Boolean] {
  const [NFTs, setNFTs] = useState<Array<NFT>>([]);
  const [isLoading, setLoading] = useState(true);
  const providerMut = useSolana();
  const fetchNFTByUser = useCallback(async () => {
    const connection = providerMut?.connection;
    const walletPublicKey = wallet?.publicKey?.toString() || '';
    if (walletPublicKey != '') {
      // check if wallet address is valid
      const publicAddress = await resolveToWalletAddress({
        text: walletPublicKey,
        connection
      });
      // get all NFT tokens from wallet
      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress,
        connection
      });
      const result = await Promise.all(
        nftArray.map(async nft => {
          const imageURI = await getNFTImgURI(nft.data.uri);

          const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(
            new PublicKey(nft.mint)
          );

          const result: NFT = {
            name: nft.data.name,
            symbol: nft.data.name,
            updateAuthority: nft.updateAuthority,
            image: imageURI,
            creators: nft.data.creators,
            mint: nft.mint,
            tokenId: tokenmetaPubkey.toString()
          };
          return result;
        })
      );
      setNFTs(result);
    } else {
      setNFTs([]);
    }
  }, [providerMut?.connection, wallet?.publicKey]);

  useEffect(() => {
    fetchNFTByUser()
      .catch(err => {
        console.error(err);
        setNFTs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchNFTByUser]);
  return [NFTs, fetchNFTByUser, isLoading];
}

//grab image URI from fetching from NFT uri
async function getNFTImgURI(uri: string) {
  if (uri && uri != '') {
    return fetch(uri)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(result => {
        return result.image;
      })
      .catch(error => {
        console.error(error);
        return '';
      });
  } else {
    return '';
  }
}
