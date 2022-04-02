declare module '*.png';
declare module '*.svg';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ===== Input new enviroment variables =====
      // ===== from .env here =====================
      NEXT_PUBLIC_RPC_NODE: string;
      NEXT_PUBLIC_STAKE_POOL_ADDRESS: string;
      NEXT_PUBLIC_LOCKER_ADDRESS: string;
      NEXT_PUBLIC_HONEY_MINT: string;
      NEXT_PUBLIC_PHONEY_MINT: string;
      NEXT_PUBLIC_WHITELIST_ENTRY: string;
      NEXT_PUBLIC_STAKE_PROGRAM_ID: string;
      NEXT_PUBLIC_VE_HONEY_PROGRAM_ID: string;
      // ==========================================
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

type Creator = {
  address: string;
  verified: number;
  share: number;
};

//tokenAcc is same as pubkey,
type NFT = {
  name: string;
  symbol?: string;
  updateAuthority: string;
  image: string;
  creators: Array<Creator>;
  tokenId: string;
  mint: string;
};
