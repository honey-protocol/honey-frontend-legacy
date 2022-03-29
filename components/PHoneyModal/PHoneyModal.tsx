import { Box, Button, Input, Stack, Text } from 'degen';
import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { web3, Wallet, Program } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import {
  useConnectedWallet,
  useSolana,
  useConnection,
  ConnectedWallet
} from '@saberhq/use-solana';
import {
  STAKE_PROGRAM_ID,
  HONEY_MINT,
  PHONEY_MINT
} from '../../helpers/sdk/index';
const stakeIdl = require('../../helpers/idl/stake.json');
import * as constants from '../../constants/vehoney';
import { Stake } from '../../helpers/types/stake.json';

const { SystemProgram, Keypair } = web3;

const clusterUrl = 'https://api.devnet.solana.com';

const PHoneyModal = () => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  // public keys
  const user = useConnectedWallet();
  const honeyMint = HONEY_MINT;
  const pHoneyMint = PHONEY_MINT;
  // const pHoneyMint = new anchor.web3.PublicKey(
  //   '7unYPivFG6cuDGeDVjhbutcjYDcMKPu2mBCnRyJ5Qki2'
  // );

  // connection todo:
  const connection = useConnection();
  const { walletProviderInfo } = useSolana();

  const provider = new anchor.Provider(connection, user as unknown as Wallet, {
    skipPreflight: false,
    preflightCommitment: 'processed',
    commitment: 'processed'
  });
  anchor.setProvider(provider);

  const stakeProgram = new Program(
    stakeIdl,
    STAKE_PROGRAM_ID,
    provider
  ) as Program<Stake>;

  const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
  const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;

  // Handles the onsubmit
  const onSubmit = () => {
    if (!depositAmount) return;
    // call the deposit phoney rpc
    depositPHoney(depositAmount);
    console.log({ depositAmount });
  };
  // Handles the onsubmit
  const onClaimSubmit = () => {
    // call the deposit phoney rpc
    claimHoney();
    console.log({ depositAmount });
  };

  // Builds the deposit to pool 1 one rpc call
  const depositPHoney = async (amount: Number) => {
    if (amount === 0) {
      console.log('No pHONEY amount has been provided');
      return;
    }
    setDepositAmount(0);
    console.log('pHONEY amount link: ', amount);
    try {
      const userPHoneyToken = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        pHoneyMint,
        user!.publicKey
      );
      const [stakePool] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.POOL_INFO_SEED),
          honeyMint.toBuffer(),
          pHoneyMint.toBuffer()
        ],
        stakeProgram.programId
      );
      const [poolUser] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(constants.POOL_USER_SEED),
          stakePool.toBuffer(),
          user!.publicKey.toBuffer()
        ],
        stakeProgram.programId
      );

      const initializeIx = stakeProgram.instruction.initializeUser({
        accounts: {
          payer: user!.publicKey,
          poolInfo: stakePool,
          userInfo: poolUser,
          userOwner: user!.publicKey,
          systemProgram: SYSTEM_PROGRAM
        },
        signers: [user]
      });

      const tx = await stakeProgram.rpc.deposit(new anchor.BN(depositAmount), {
        accounts: {
          poolInfo: stakePool,
          userInfo: poolUser,
          userOwner: user!.publicKey,
          pTokenMint: pHoneyMint,
          source: userPHoneyToken,
          userAuthority: user!.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        preInstructions: [initializeIx],
        signers: [user]
      });

      //
      console.log(tx);
      console.log('pHoney deposited succesfully ');
    } catch (error) {
      console.log('Error depositing pHoney : ', error);
    }
  };

  const claimHoney = async () => {
    const userPHoneyToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      honeyMint,
      user!.publicKey
    );
    const [stakePool] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(constants.POOL_INFO_SEED),
        honeyMint.toBuffer(),
        pHoneyMint.toBuffer()
      ],
      stakeProgram.programId
    );
    const [vaultAuthority, vaultAuthorityBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(constants.VAULT_AUTHORITY_SEED), stakePool.toBuffer()],
        stakeProgram.programId
      );

   
    const [poolUser] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(constants.POOL_USER_SEED),
        stakePool.toBuffer(),
        user!.publicKey.toBuffer()
      ],
      stakeProgram.programId
    );

    await stakeProgram.rpc.claim({
      accounts: {
        payer: user!.publicKey,
        poolInfo: stakePool,
        authority: vaultAuthority,
        tokenMint: honeyMint,
        userInfo: poolUser,
        userOwner: user!.publicKey,
        destination: userPHoneyToken,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      preInstructions: [
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          honeyMint,
          userPHoneyToken,
          user!.publicKey,
          user!.publicKey
        )
      ],
      signers: [user]
    });
  };

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get HONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and recieve HONEY
          </Text>
          <Box
            marginX="auto"
            borderColor="accent"
            borderWidth="0.375"
            height="7"
            borderRadius="large"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3/4"
          >
            <Text variant="small" color="accent">
              1 pHONEY = 1 HONEY
            </Text>
          </Box>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY deposited
              </Text>
              <Text variant="small">332,420</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY balance
              </Text>
              <Text variant="small">332,420</Text>
            </Stack>
          </Stack>
          <Input
            value={depositAmount}
            type="number"
            label="Amount"
            hideLabel
            units="pHONEY"
            // placeholder="0"
            onChange={event => setDepositAmount(Number(event.target.value))}
          />
          <Button
            onClick={onSubmit}
            disabled={depositAmount ? false : true}
            width="full"
          >
            {depositAmount ? 'Deposit' : 'Enter amount'}
          </Button>
          <Button
            onClick={onClaimSubmit}
            // Make disabled
            disabled={true}
            width="full"
          >
            Claim
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PHoneyModal;
