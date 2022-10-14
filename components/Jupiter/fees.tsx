import { PublicKey } from "@solana/web3.js";
import sanitizedConfig from "config";

export const FEES = new PublicKey(sanitizedConfig.NEXT_PUBLIC_JUPITER_FEE_WALLET_ADDRESS as string);
export const FEES_BPS: number = sanitizedConfig.NEXT_PUBLIC_JUPITER_FEE_BPS;
