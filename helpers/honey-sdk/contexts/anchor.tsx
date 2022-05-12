import { Program } from '@project-serum/anchor';
import React, { FC, ReactNode, useContext, useEffect, useState } from 'react'
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { ConnectedWallet } from '../helpers/walletType';
import devnetIdl from '../idl/devnet/honey.json';
import mainnetBetaIdl from "../idl/mainnet-beta/honey.json";

export interface AnchorContext {
  program: Program,
  coder: anchor.Coder,
  isConfigured: boolean
}
const AnchorContext = React.createContext<AnchorContext>(null!);

export const useAnchor = () => {
  const context = useContext(AnchorContext);
  return context;
};

export interface WebWallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export interface AnchorProviderProps {
  children: ReactNode,
  wallet: ConnectedWallet | null,
  connection: Connection,
  network: string,
  honeyProgram: string
}

export const AnchorProvider: FC<AnchorProviderProps> = ({
  children,
  wallet,
  connection,
  network,
  honeyProgram
}) => {
  const [program, setProgram] = useState<Program>({} as Program);
  const [coder, setAnchorCoder] = useState<anchor.Coder>({} as anchor.Coder);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    // setup coder for anchor operations
    const setup = async () => {
      const idl: any = network === 'devnet' ? devnetIdl : mainnetBetaIdl;
      setAnchorCoder(new anchor.Coder(idl));
      // init program
      const HONEY_PROGRAM_ID = new PublicKey(honeyProgram);
      const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
      const anchorProgram: Program = new anchor.Program(idl as any, HONEY_PROGRAM_ID, provider);
      setProgram(anchorProgram);
      setIsConfigured(true);
    };

    if (connection && wallet)
      setup();
  }, [connection, wallet])

  return (
    <AnchorContext.Provider
      value={{
        program,
        coder,
        isConfigured
      }}>
      {children}
    </AnchorContext.Provider>
  )
}
