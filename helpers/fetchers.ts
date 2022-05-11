import type { Idl } from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { makeAnchorProvider } from '@saberhq/anchor-contrib';
import { fetchNullableWithSessionCache } from '@saberhq/sail';
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib';
import type { Connection } from '@solana/web3.js';
import { Keypair, PublicKey } from '@solana/web3.js';

export const fetchIDL = async (
  connection: Connection,
  address: string
): Promise<Idl | null> => {
  const response = await fetchNullableWithSessionCache<Idl>(
    `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/idls/${address}.json`
  );
  if (response === null) {
    return await Program.fetchIdl(
      new PublicKey(address),
      makeAnchorProvider(
        SolanaProvider.init({
          connection,
          wallet: new SignerWallet(Keypair.generate())
        })
      )
    );
  }
  return response;
};
