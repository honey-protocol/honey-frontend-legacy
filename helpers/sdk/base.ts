import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export class ClientBase<T extends anchor.Idl> {
  private provider!: anchor.Provider;
  program!: anchor.Program<T>;

  constructor(
    private connection: Connection,
    public wallet: anchor.Wallet,
    idl: any,
    programId: PublicKey
  ) {
    this.connection = connection;
    this.wallet = wallet;
    this.setProvider();
    this.setProgram(idl, programId);
  }

  setProvider() {
    this.provider = new anchor.Provider(
      this.connection,
      this.wallet,
      anchor.Provider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setProgram(idl: any, programId: PublicKey) {
    if (!idl || !programId) {
      throw new Error("Program can't be constructed.");
    }
    this.program = new anchor.Program<T>(
      idl,
      new PublicKey(programId),
      this.provider
    );
  }
}
