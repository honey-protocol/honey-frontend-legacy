import { useState, useEffect, useRef, MutableRefObject, SetStateAction, Dispatch } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner
} from '@nfteyez/sol-rayz';
import { ConnectedWallet, useSolana } from '@saberhq/use-solana';
import { programs } from '@metaplex/js';

interface NFTArrayType {
  [index: string]: Array<NFT>
}

const defaultNFT: NFT = {
  name: "",
  updateAuthority: "",
  image: "",
  creators: [],
  tokenId: "",
  mint: "",
}

//this function should fetch all NFT from User
export default function useFetchNFTByUser(wallet: ConnectedWallet | null): [Array<NFT>, Boolean, Dispatch<SetStateAction<{}>>] {
  const [NFTs, setNFTs] = useState<Array<NFT>>([]);
  const [isLoading, setLoading] = useState(true);
  const providerMut = useSolana();
  //adding shouldRefetchNFTs to force refetching by passing {} to refecthNFTs
  const [shouldRefetchNFTs, refetchNFTs] = useState({});
  const shouldRefetchRef: MutableRefObject<{}> = useRef(shouldRefetchNFTs)
  const cache: MutableRefObject<NFTArrayType> = useRef({})
  useEffect(() => {
    let didCancel = false
    const fetchNFTByUser = async () => {
      if (!didCancel) {
        const connection = providerMut?.connection
        const walletPublicKey = wallet?.publicKey?.toString() || ""
        if (walletPublicKey != "") {
          // we need to check if shouldRefetchNFTs trigger this function and we should do refetch instead of getting from cache
          if (cache.current[walletPublicKey] && shouldRefetchRef.current === shouldRefetchNFTs) {
            console.log(`fetching NFT for wallet public key ${walletPublicKey} from cache`)
            const result = cache.current[walletPublicKey]
            setNFTs(result)
          } else {
            console.log(`cache miss or force re-fetching, fetching NFT for wallet public key ${walletPublicKey}`)
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
            // We are mapping the exception to default NFT to be filtered out later to make typescript happy
            const results = await Promise.all(promises.map(p => p.catch(e => {
              console.error("Error fetching individual NFT with error")
              console.error(e)
              return defaultNFT
            })));
            const validResults = results.filter(result => !(result.name == ""));
            cache.current[walletPublicKey] = validResults
            shouldRefetchRef.current = shouldRefetchNFTs
            setNFTs(validResults)
          }
        } else {
          setNFTs([])
        }
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

    return () => {
      didCancel = true
    }
  }, [wallet, shouldRefetchNFTs])
  return [NFTs, isLoading, refetchNFTs]

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