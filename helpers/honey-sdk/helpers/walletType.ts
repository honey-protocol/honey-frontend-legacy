import { PublicKey as SolanaPublicKey, Transaction } from '@solana/web3.js';

export type ConnectedWallet = WalletAdapter<boolean>;

export interface WalletAdapter<Connected extends boolean = boolean> {
  publicKey: Connected extends true ? SolanaPublicKey : null;
  autoApprove: boolean;
  connected: Connected;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>;
  connect: (args?: unknown) => Promise<void>;
  disconnect: () => void | Promise<void>;
  on(event: 'connect' | 'disconnect', fn: () => void): void;
}
export interface WalletProvider {
  name: string;
  logo: string;
  url: string;
}
