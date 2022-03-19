import { programs } from '@metaplex/js';
import { Connection, PublicKey } from '@solana/web3.js';

export const convertArrayToObject = (array: any[], key: string) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item
    };
  }, initialValue);
};

/**
 * @params mint: the nft mint address, connection
 * @description extract metadata for a nft
 * @returns the NFT data for the nft
 **/
export const extractMetaData = async (
  mint: PublicKey,
  connection: Connection
): Promise<NFT> => {
  const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(
    new PublicKey(mint)
  );
  const tokenmeta = await programs.metadata.Metadata.load(
    connection,
    tokenmetaPubkey
  );

  let nftMetaData = await (await fetch(tokenmeta.data.data.uri)).json();
  return {
    name: nftMetaData.name,
    symbol: nftMetaData.symbol,
    updateAuthority: tokenmeta.data.updateAuthority,
    image: nftMetaData.image,
    creators: nftMetaData.properties.creators,
    tokenId: tokenmetaPubkey.toString(),
    mint: mint.toString()
  };
};
