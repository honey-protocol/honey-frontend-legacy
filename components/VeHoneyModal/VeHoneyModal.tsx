import { Box, Button, Input, Stack, Text } from 'degen';
import React, { ChangeEvent, useState } from 'react';
import * as styles from './VeHoneyModal.css';
import * as idl from '../../idl/ve_honey.json';
import * as anchor from '@project-serum/anchor';
import { web3, Program, Wallet } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import type { VeHoney } from '../../helpers/types/ve_honey';
import type { Stake } from '../../helpers/types/stake';
import * as constants from '../../constants/vehoney';
import {
  useConnectedWallet,
  useSolana,
  SolanaProvider,
  useConnection
} from '@saberhq/use-solana';

const { SystemProgram, Keypair } = web3;

// const programID = new PublicKey(idl.metadata.address)
// console.log(programID)

const programID = new anchor.web3.PublicKey(
  "6ambmng2tpfATEvkofjne6dSA49PswjHC24FvDmG14qZ"
);
const stakeProgramID = new anchor.web3.PublicKey(
  "6Ko5DhTrcvsMasSdAYAwWWMVq5v2bMwCa1nYxZ5Cozh6"
);

const clusterUrl = 'https://api.devnet.solana.com';

const VeHoneyModal = () => {
  const [amount, setAmount] = useState<number>();
  const [vestingPeriod, setVestingPeriod] = useState('3 months');
  const veHoneyRewardRate =
    vestingPeriod === '3 months'
      ? 2
      : vestingPeriod === '6 months'
      ? 5
      : vestingPeriod === '12 months'
      ? 10
      : 1;

  const onSubmit = () => {
    if (!amount) return;
    stakeVehoney(amount, vestingPeriod);
    console.log({ amount, vestingPeriod });
  };

  // Anchor imports
  const payer: Wallet = useConnectedWallet();

  const connection = useConnection();
  const {walletProviderInfo} = useSolana();

  const provider = new anchor.Provider(connection, payer, {
    skipPreflight: false,
    preflightCommitment: 'processed',
    commitment: 'processed'
  });
  anchor.setProvider(provider);
  // const program = anchor.workspace.VeHoney as Program<VeHoney>;
  const program = new Program(idl, programID, provider) as Program<VeHoney>;

  const publicConnection = new anchor.web3.Connection(clusterUrl, {
    commitment: 'processed'
  });

  const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
  const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;

  const user = anchor.web3.Keypair.generate();
  let honeyMint: Token;
  let pHoneyMint: Token;
  const base = anchor.web3.Keypair.generate();
  let userPHoneyToken: anchor.web3.PublicKey,
    userHoneyToken: anchor.web3.PublicKey,
    locker: anchor.web3.PublicKey,
    escrow: anchor.web3.PublicKey,
    lockedTokens: anchor.web3.PublicKey,
    whitelistEntry: anchor.web3.PublicKey;
  const lockerParams = {
    whitelistEnabled: true,
    minStakeDuration: new anchor.BN(1),
    maxStakeDuration: new anchor.BN(5),
    multiplier: 48
  };

  // const stakeProgram = anchor.workspace.Stake as Program<Stake>;
  const stakeProgram = new Program(idl, stakeProgramID, provider) as Program<Stake>;

  let tokenVault: anchor.web3.PublicKey,
    tokenVaultBump: number,
    vaultAuthority: anchor.web3.PublicKey,
    vaultAuthorityBump: number;

  const stakeVehoney = async (amount: Number, vestingPeriod: String) => {
    if (amount === 0 ) {
      console.log('No pHONEY amount has been provided')
      return 
    }
    setAmount(0);
    console.log('pHONEY amount link: ', amount);
    try {
    
      // console.log('ping')
      let escrowBump: number;
      [escrow, escrowBump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.ESCROW_SEED),
          locker.toBuffer(),
          user.publicKey.toBuffer(),
        ],
        program.programId
      );
  
      lockedTokens = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        honeyMint.publicKey,
        escrow,
        true
      );
  
      await stakeProgram.rpc.stake(
        vaultAuthorityBump,
        new anchor.BN(Number(amount)), // remove Number to see error
        new anchor.BN(vestingPeriod),
        {
          accounts: {
            tokenMint: honeyMint.publicKey,
            pTokenMint: pHoneyMint.publicKey,
            pTokenFrom: userPHoneyToken, // no access 
            userAuthority: user.publicKey,
            tokenVault,
            authority: vaultAuthority,
            locker,
            escrow,
            lockedTokens,
            lockerProgram: program.programId,
            tokenProgram: TOKEN_PROGRAM_ID
          },
          remainingAccounts: [
            {
              pubkey: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              isSigner: false,
              isWritable: false
            },
            {
              pubkey: whitelistEntry,
              isSigner: false,
              isWritable: false
            }
          ],
          preInstructions: [
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              honeyMint.publicKey,
              lockedTokens,
              escrow,
              user.publicKey
            ),
            program.instruction.initEscrow({
              accounts: {
                payer: user.publicKey,
                locker,
                escrow: escrow,
                escrowOwner: user.publicKey,
                systemProgram: SYSTEM_PROGRAM
              },
              signers: [user]
            })
          ],
          signers: [user]
        }
      );
      //
      console.log(
        'pHoney staked succesfully ',
      );
    } catch (error) {
      console.log('Error staking pHoney account: ', error);
    }
  };

  // console.log('Payer', payer);
  // console.log('Connection', connection);
  // console.log('Provider', provider);
  // console.log('Program', program);

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get veHONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and recieve veHONey
          </Text>
          <Stack space="2">
            <Text align="center" size="small">
              After vesting, you get:
            </Text>
            <Box
              marginX="auto"
              borderColor="accent"
              borderWidth="0.375"
              minHeight="7"
              borderRadius="large"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="3/4"
            >
              <Text variant="small" color="accent">
                {amount || '0'} pHONEY = {(amount || 0) * veHoneyRewardRate}{' '}
                HONEY
              </Text>
            </Box>
          </Stack>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHoney deposited
              </Text>
              <Text variant="small">--</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY balance
              </Text>
              <Text variant="small">--</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Vesting period
              </Text>
              <Box>
                <select
                  name="vestingPeriod"
                  value={vestingPeriod}
                  className={styles.select}
                  onChange={event => setVestingPeriod(event.target.value)}
                >
                  <option value='30'>3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                </select>
              </Box>
            </Stack>
          </Stack>
          <Input
            value={amount}
            type="number"
            label="Amount"
            hideLabel
            units="pHONEY"
            // placeholder="0"
            onChange={event => setAmount(Number(event.target.value))}
          />
          <Button
            onClick={onSubmit}
            disabled={amount ? false : true}
            width="full"
          >
            {amount ? 'Deposit' : 'Enter amount'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default VeHoneyModal;
