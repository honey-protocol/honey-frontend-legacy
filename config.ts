interface ENV {
  NEXT_PUBLIC_LOCKER_ADDR: string | undefined;
  NEXT_PUBLIC_VOTER_PROGRAM_ID: string | undefined;
  NEXT_PUBLIC_STAKE_PROGRAM_ID: string | undefined;
  NEXT_PUBLIC_GOVERNOR_ADDRESS: string | undefined;
  NEXT_PUBLIC_SMART_WALLET_ADDRESS: string | undefined;
  NEXT_PUBLIC_RPC_NODE: string | undefined;
  NEXT_PUBLIC_GA: string | undefined;
  NEXT_PUBLIC_WHITELIST_ENTRY: string | undefined;
  NEXT_PUBLIC_PHONEY_MINT: string | undefined;
  NEXT_PUBLIC_HONEY_MINT: string | undefined;
  NEXT_PUBLIC_STAKE_POOL_ADDRESS: string | undefined;
  NEXT_PUBLIC_HONEY_MINT_WRAPPER: string | undefined;
}

interface Config {
  NEXT_PUBLIC_LOCKER_ADDR: string;
  NEXT_PUBLIC_VOTER_PROGRAM_ID: string;
  NEXT_PUBLIC_STAKE_PROGRAM_ID: string;
  NEXT_PUBLIC_GOVERNOR_ADDRESS: string;
  NEXT_PUBLIC_SMART_WALLET_ADDRESS: string;
  NEXT_PUBLIC_RPC_NODE: string;
  NEXT_PUBLIC_GA: string;
  NEXT_PUBLIC_WHITELIST_ENTRY: string;
  NEXT_PUBLIC_PHONEY_MINT: string;
  NEXT_PUBLIC_HONEY_MINT: string;
  NEXT_PUBLIC_STAKE_POOL_ADDRESS: string;
  NEXT_PUBLIC_HONEY_MINT_WRAPPER: string;
}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    NEXT_PUBLIC_LOCKER_ADDR: process.env.NEXT_PUBLIC_LOCKER_ADDR,
    NEXT_PUBLIC_VOTER_PROGRAM_ID: process.env.NEXT_PUBLIC_VOTER_PROGRAM_ID,
    NEXT_PUBLIC_STAKE_PROGRAM_ID: process.env.NEXT_PUBLIC_STAKE_PROGRAM_ID,
    NEXT_PUBLIC_GOVERNOR_ADDRESS: process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS,
    NEXT_PUBLIC_SMART_WALLET_ADDRESS:
      process.env.NEXT_PUBLIC_SMART_WALLET_ADDRESS,
    NEXT_PUBLIC_RPC_NODE: process.env.NEXT_PUBLIC_RPC_NODE,
    NEXT_PUBLIC_GA: process.env.NEXT_PUBLIC_GA,
    NEXT_PUBLIC_WHITELIST_ENTRY: process.env.NEXT_PUBLIC_WHITELIST_ENTRY,
    NEXT_PUBLIC_PHONEY_MINT: process.env.NEXT_PUBLIC_PHONEY_MINT,
    NEXT_PUBLIC_HONEY_MINT: process.env.NEXT_PUBLIC_HONEY_MINT,
    NEXT_PUBLIC_STAKE_POOL_ADDRESS: process.env.NEXT_PUBLIC_STAKE_POOL_ADDRESS,
    NEXT_PUBLIC_HONEY_MINT_WRAPPER: process.env.NEXT_PUBLIC_HONEY_MINT_WRAPPER
  };
};

// Throwing an Error if any field was undefined
const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
