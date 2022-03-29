import { Box, Button, Input, Stack, Text } from 'degen';
import React, { ChangeEvent, useState } from 'react';
import * as styles from './VeHoneyModal.css';
const idl = require('../../helpers/idl/ve_honey.json');
const stakeIdl = require('../../helpers/idl/stake.json');
import * as anchor from '@project-serum/anchor';
import { web3, Wallet, Program } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import type { Stake } from '../../helpers/types/stake';
import type { VeHoney } from '../../helpers/types/stake';

import * as constants from '../../constants/vehoney';
import {
  STAKE_PROGRAM_ID,
  VE_HONEY_PROGRAM_ID,
  HONEY_MINT
  // PHONEY_MINT
} from '../../helpers/sdk/index';
import {
  useConnectedWallet,
  useSolana,
  SolanaProvider,
  useConnection,
  ConnectedWallet
} from '@saberhq/use-solana';
const { SystemProgram } = web3;

// todo import these from sdk
const programID = new anchor.web3.PublicKey(
  'CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q'
);
// todo import these from sdk
const stakeProgramID = new anchor.web3.PublicKey(
  '4V68qajTiVHm3Pm9fQoV8D4tEYBmq3a34R9NV5TymLr7'
);

const clusterUrl = 'https://api.devnet.solana.com';

const VeHoneyModal = () => {
  const [amount, setAmount] = useState<number>();
  const [vestingPeriod, setVestingPeriod] = useState(1);
  const veHoneyRewardRate =
    vestingPeriod === 7689600
      ? 2
      : vestingPeriod === 15811200
      ? 5
      : vestingPeriod === 31622400
      ? 10
      : 1;

  const onSubmit = () => {
    if (!amount) return;
    stakeVehoney(amount, vestingPeriod);
    console.log({ amount, vestingPeriod });
  };

  // Anchor imports
  const user: ConnectedWallet | null = useConnectedWallet();
  const honeyMint = HONEY_MINT;
  const pHoneyMint = new anchor.web3.PublicKey(
    '7unYPivFG6cuDGeDVjhbutcjYDcMKPu2mBCnRyJ5Qki2'
  );
  const base = new anchor.web3.PublicKey(
    'BaigWR1uBJ5JbVXHaK1DgnzwbTykugFzFuBoi2dc9RZA'
  );
  const connection = useConnection();
  const { walletProviderInfo } = useSolana();

  const provider = new anchor.Provider(connection, user as unknown as Wallet, {
    skipPreflight: false,
    preflightCommitment: 'processed',
    commitment: 'processed'
  });
  anchor.setProvider(provider);

  const program = new Program(idl, programID, provider) as Program<VeHoney>;

  const publicConnection = new anchor.web3.Connection(clusterUrl, {
    commitment: 'processed'
  });

  const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
  const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;

  // const stakeProgram = anchor.workspace.Stake as Program<Stake>;
  const stakeProgram = new Program(
    stakeIdl,
    stakeProgramID,
    provider
  ) as Program<Stake>;

  const stakeVehoney = async (amount: Number, vestingPeriod: Number) => {
    if (amount === 0) {
      console.log('No pHONEY amount has been provided');
      return;
    }
    setAmount(0);
    console.log('pHONEY amount link: ', amount);
    try {
      const userPHoneyToken = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        pHoneyMint,
        user!.publicKey
      );
      const [tokenVault, tokenVaultBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from(constants.TOKEN_VAULT_SEED),
            honeyMint.toBuffer(),
            pHoneyMint.toBuffer()
          ],
          stakeProgram.programId
        );
      const [locker, lockerBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from(constants.LOCKER_SEED), base.toBuffer()],
          program.programId
        );

      const [escrow, escrowBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from(constants.ESCROW_SEED),
            locker.toBuffer(),
            user!.publicKey.toBuffer()
          ],
          program.programId
        );

      const lockedTokens = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        honeyMint,
        escrow,
        true
      );

      const [stakePool] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.POOL_INFO_SEED),
          honeyMint.toBuffer(),
          pHoneyMint.toBuffer()
        ],
        STAKE_PROGRAM_ID
      );

      const [vaultAuthority] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from(constants.VAULT_AUTHORITY_SEED), stakePool.toBuffer()],
          stakeProgram.programId
        );

      const [whitelistEntry] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from(constants.WHITELIST_ENTRY_SEED),
            locker.toBuffer(),
            stakeProgram.programId.toBuffer(),
            SYSTEM_PROGRAM.toBuffer()
          ],
          program.programId
        );
        const tx = await stakeProgram.rpc.stake(
        new anchor.BN(Number(amount)),
        new anchor.BN(Number(vestingPeriod)),
        {
          accounts: {
            poolInfo: stakePool,
            tokenMint: honeyMint,
            pTokenMint: pHoneyMint,
            pTokenFrom: userPHoneyToken,
            userAuthority: user!.publicKey,
            tokenVault,
            authority: vaultAuthority,
            locker,
            escrow,
            lockedTokens,
            lockerProgram: program.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
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
              honeyMint,
              lockedTokens,
              escrow,
              user!.publicKey
            ),
            program.instruction.initEscrow({
              accounts: {
                payer: user!.publicKey,
                locker,
                escrow: escrow,
                escrowOwner: user!.publicKey,
                systemProgram: SYSTEM_PROGRAM
              },
              signers: [user]
            })
          ],
          signers: [user]
        }
      );
      //
      console.log('pHoney staked succesfully ');
    } catch (error) {
      console.log('Error staking pHoney account: ', error);
    }
  };

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
                  onChange={event =>
                    setVestingPeriod(Number(event.target.value))
                  }
                >
                  <option value="7689600">3 months</option>
                  <option value="15811200">6 months</option>
                  <option value="31622400">12 months</option>
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
