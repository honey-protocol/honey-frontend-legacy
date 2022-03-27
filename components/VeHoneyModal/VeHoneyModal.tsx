import { Box, Button, Input, Stack, Text } from 'degen';
import React, { ChangeEvent, useState } from 'react';
import * as styles from './VeHoneyModal.css';
import * as idl from "../../idl/ve_honey.json"
import * as anchor from "@project-serum/anchor";
import { web3, Program } from '@project-serum/anchor'
import { Connection, PublicKey, clusterApiUrl} from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import type { VeHoney } from "../../types/ve_honey";
import { Stake } from "../../types/stake";
import * as constants from "../../constants/vehoney";
// TODO best find way to import IDLs currently is done with nodejs fs. Find out if needed since you alrady have program ID
import { useConnectedWallet, useSolana , useConnection} from '@saberhq/use-solana';

const { SystemProgram, Keypair} = web3;

const programID = new PublicKey(idl.metadata.address)
console.log(programID)

const programId = new anchor.web3.PublicKey(
  "CKQapf8pWoMddT15grV8UCPjiLCTHa12NRgkKV63Lc7q"
);
const clusterUrl = "https://api.devnet.solana.com";


// const connection = new anchor.web3.Connection(clusterUrl, "processed");
// const provider = new anchor.Provider(connection, new anchor.Wallet(payer), {
//   skipPreflight: false,
//   preflightCommitment: "processed",
//   commitment: "processed",
// });
// anchor.setProvider(provider);

// const program = anchor.workspace.VeHoney as Program<VeHoney>;
// const publicConnection = new anchor.web3.Connection(clusterUrl, {
//   commitment: "processed",
// });

// const SYSTEM_PROGRAM = anchor.web3.SystemProgram.programId;
// const TOKEN_PROGRAM_ID = anchor.Spl.token().programId;
// const LAMPORTS_PER_SOL = anchor.web3.LAMPORTS_PER_SOL;

// const admin = anchor.web3.Keypair.generate(); // TODO: save this key, and load  on runtime
// const user = anchor.web3.Keypair.generate(); // TODO: save this key, and load on runtime
// let honeyMint: Token;
// let pHoneyMint: Token;
// const honeyMintAuthority = anchor.web3.Keypair.generate(); // TODO: save this key, and load  on runtime
// const pHoneyMintAuthority = anchor.web3.Keypair.generate(); // TODO: save this key, and load  on runtime
// const base = anchor.web3.Keypair.generate(); // TODO: save this key, and load  on runtime
// let userPHoneyToken: anchor.web3.PublicKey,
//   userHoneyToken: anchor.web3.PublicKey,
//   locker: anchor.web3.PublicKey,
//   escrow: anchor.web3.PublicKey,
//   lockedTokens: anchor.web3.PublicKey,
//   whitelistEntry: anchor.web3.PublicKey;
// const lockerParams = {
//   whitelistEnabled: true,
//   minStakeDuration: new anchor.BN(1),
//   maxStakeDuration: new anchor.BN(5),
//   multiplier: 48,
// };
// const stakeProgram = anchor.workspace.Stake as Program<Stake>;
// let tokenVault: anchor.web3.PublicKey,
//   tokenVaultBump: number,
//   vaultAuthority: anchor.web3.PublicKey,
//   vaultAuthorityBump: number;

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
    console.log({ amount, vestingPeriod });
  };
  // const payer = anchor.web3.Keypair.generate();
  const wallet = useConnectedWallet();

  const connection = useConnection();
  const provider = new anchor.Provider(connection,  wallet , {
    skipPreflight: false,
    preflightCommitment: "processed",
    commitment: "processed",
  });
  console.log("Payer", wallet)
  console.log("Connection", connection)
  console.log("Provider", provider)

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
                  <option value="3 months">3 months</option>
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
