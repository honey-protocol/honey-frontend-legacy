declare module '*.png';
declare module '*.svg';

type Creator = {
  address: string;
  verified: number;
  share: number;
};

//tokenAcc is same as pubkey,
export type NFT = {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<{
        pubKey: string
        address: string
      }>
    }
    seller_fee_basis_points: number
  }
}
