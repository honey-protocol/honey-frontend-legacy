import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner
} from '@nfteyez/sol-rayz';
import { ConnectedWallet, useSolana } from '@saberhq/use-solana';
import { programs } from '@metaplex/js';

const defaultNFT: NFT = {
  name: "",
  updateAuthority: "",
  image: "",
  creators: [],
  tokenId: "",
  mint: "",
}

//this function should fetch all NFT from User
export default function useFetchNFTByUser(wallet: ConnectedWallet | null): [Array<NFT>, Boolean] {
  const [NFTs, setNFTs] = useState<Array<NFT>>([]);
  const [isLoading, setLoading] = useState(true);
  const providerMut = useSolana();
  useEffect(() => {
    const fetchNFTByUser = async () => {
      const connection = providerMut?.connection
      const walletPublicKey = wallet?.publicKey?.toString() || ""
      if (walletPublicKey != "") {
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
        const promises = nftArray.map(async (nft) => {
            const imageURI = await getNFTImgURI(nft.data.uri)
            const tokenMetaPublicKey = await programs.metadata.Metadata.getPDA(
              new PublicKey(nft.mint)
            );
            const result: NFT = {
              name: nft.data.name,
              symbol: nft.data.name,
              updateAuthority: nft.updateAuthority,
              image: imageURI,
              creators: nft.data.creators,
              mint: nft.mint,
              tokenId: tokenMetaPublicKey.toString()
            }
            return result
          }
        )
        // someone has better idea to make it better
        const results = await Promise.all(promises.map(p => p.catch(e => {
          console.error("Error fetching individual NFT with error")
          console.error(e)
          return defaultNFT
        })));
        const validResults = results.filter(result => !(result.name == ""));
        setNFTs(validResults)
      } else {
        setNFTs([])
      }
    }

    fetchNFTByUser()
      .catch((err) => {
        console.error("Error calling fetch NFT by user")
        console.error(err)
        setNFTs([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [wallet])
  return [NFTs, isLoading]

}

//grab image URI from fetching from NFT uri
async function getNFTImgURI(uri: string) {
  if (uri && uri != "") {
    return fetch(uri)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK when fetching NFT image URI')
        }
        return response.json()
      })
      .then(result => {
        return result.image
      })
      .catch(error => {
        console.error(`Error occurred while getting NFT image URI: ${uri}`)
        console.error(error)
        return ""
      })
  } else {
    return ""
  }
}