import { findMinterAddress, QUARRY_CODERS } from '@quarryprotocol/quarry-sdk';
import {
  TOKEN_ACCOUNT_PARSER,
  useParsedAccountData,
  usePubkey,
  useSail
} from '@saberhq/sail';
import { buildStubbedTransaction } from '@saberhq/solana-contrib';
import {
  getATAAddress,
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID
} from '@saberhq/token-utils';
import { useSolana } from '@saberhq/use-solana';
import type { TransactionInstruction } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import invariant from 'tiny-invariant';

import { AsyncButton } from 'components/common/AsyncButton';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useParseTokenAmount } from 'hooks/useParseTokenAmount';
import { serializeToBase64 } from 'helpers/makeTransaction';
import { useParsedMintWrapper } from 'helpers/parser';
import type { ActionFormProps } from '../../types';
import { Input } from 'degen';

export const IssueTokensAction: React.FC<ActionFormProps> = ({
  actor,
  ctx,
  setError,
  setTxRaw
}: ActionFormProps) => {
  const { govToken } = useGovernor();
  const [amountStr, setAmountStr] = useState<string>('');
  const [destinationStr, setDestinationStr] = useState<string>('');
  const { network, providerMut } = useSolana();
  const amount = useParseTokenAmount(govToken, amountStr);
  const recipient = usePubkey(destinationStr);
  const { handleTX } = useSail();

  const minter = ctx?.minter;
  const mintWrapper = useMemo(
    () => (minter ? minter.mintWrapper : null),
    [minter]
  );
  const { data: mintWrapperData } = useParsedMintWrapper(mintWrapper);
  const { data: iouATAKey } = useQuery(
    ['ata', mintWrapperData?.accountInfo.data.tokenMint, actor?.toString()],
    async () => {
      invariant(mintWrapperData && actor);
      return await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: actor
      });
    },
    { enabled: !!mintWrapperData && !!actor }
  );
  const { data: iouATA } = useParsedAccountData(
    iouATAKey,
    TOKEN_ACCOUNT_PARSER
  );

  const outputToken = mintWrapperData?.accountInfo.data.tokenMint;
  const { data: outputATAKey } = useQuery(
    ['ata', outputToken?.toString(), actor?.toString()],
    async () => {
      invariant(outputToken && actor);
      return await getATAAddress({
        mint: outputToken,
        owner: actor
      });
    },
    { enabled: !!mintWrapperData && !!actor }
  );
  const { data: outputATA } = useParsedAccountData(
    outputATAKey,
    TOKEN_ACCOUNT_PARSER
  );

  const { data: recipientATAKey } = useQuery(
    ['ata', outputToken?.toString(), recipient?.toString()],
    async () => {
      invariant(outputToken && recipient);
      return await getATAAddress({
        mint: outputToken,
        owner: recipient
      });
    },
    { enabled: !!outputToken && !!recipient }
  );
  const { data: recipientATA } = useParsedAccountData(
    recipientATAKey,
    TOKEN_ACCOUNT_PARSER
  );

  useEffect(() => {
    if (
      !providerMut ||
      !mintWrapper ||
      !actor ||
      !amount ||
      !recipient ||
      !mintWrapperData ||
      !govToken
    ) {
      return;
    }
    void (async () => {
      const [minter] = await findMinterAddress(mintWrapper, actor);

      const ixs: TransactionInstruction[] = [];

      const destinationATA = await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: recipient
      });

      const mintDestination = destinationATA;

      const mintIX = QUARRY_CODERS.MintWrapper.encodeIX(
        'performMint',
        { amount: amount.toU64() },
        {
          mintWrapper,
          minterAuthority: actor,
          destination: mintDestination,
          minter,
          tokenMint: mintWrapperData.accountInfo.data.tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      );
      ixs.push(mintIX);

      try {
        const txStub = buildStubbedTransaction(
          network !== 'localnet' ? network : 'devnet',
          ixs
        );
        setTxRaw(serializeToBase64(txStub));
        setError(null);
      } catch (ex) {
        setTxRaw('');
        console.debug('Error issuing tokens', ex);
        setError('Error generating proposal');
      }
    })();
  }, [
    amount,
    recipient,
    govToken,
    mintWrapper,
    mintWrapperData,
    network,
    providerMut,
    setError,
    setTxRaw,
    actor
  ]);

  return (
    <>
      <Input
        label="Amount"
        type="number"
        min={0}
        value={amountStr || ''}
        onChange={e => setAmountStr(e.target.value)}
        disabled={!actor}
      />
      {/* <InputTokenAmount
        label="Amount"
        token={govToken ?? null}
        tokens={[]}
        tw="h-auto"
        inputValue={amountStr}
        inputDisabled={!actor}
        inputOnChange={e => {
          setAmountStr(e);
        }}
      /> */}
      <Input
        label="Recipient"
        id="destination"
        placeholder="Address to give tokens to"
        onChange={e => setDestinationStr(e.target.value)}
      />
      {/* <label tw="flex flex-col gap-1" htmlFor="destination">
        <span tw="text-sm">Recipient</span>
        <InputText
          id="destination"
          placeholder="Address to give tokens to."
          value={destinationStr}
          onChange={e => {
            setDestinationStr(e.target.value);
          }}
        />
      </label> */}
      {((iouATAKey && iouATA === null) ||
        (outputATAKey && outputATA === null) ||
        (recipientATAKey && recipientATA === null)) && (
        <AsyncButton
          disabled={!mintWrapperData || !actor || !outputToken}
          onClick={async sdkMut => {
            invariant(mintWrapperData && actor && outputToken);
            const ixs: (TransactionInstruction | null)[] = [];
            const { instruction: createMintWrapperATAIX } =
              await getOrCreateATA({
                provider: sdkMut.provider,
                mint: mintWrapperData.accountInfo.data.tokenMint,
                owner: actor
              });
            ixs.push(createMintWrapperATAIX);

            if (
              !outputToken.equals(mintWrapperData.accountInfo.data.tokenMint)
            ) {
              const { instruction: createRedeemATAIX } = await getOrCreateATA({
                provider: sdkMut.provider,
                mint: outputToken,
                owner: actor
              });
              ixs.push(createRedeemATAIX);
            }
            if (recipient) {
              const { instruction: recipientATA } = await getOrCreateATA({
                provider: sdkMut.provider,
                mint: outputToken,
                owner: recipient
              });
              ixs.push(recipientATA);
            }
            const { pending, success } = await handleTX(
              sdkMut.provider.newTX(ixs),
              'Create token accounts'
            );
            if (!success || !pending) {
              return;
            }
            await pending.wait();
          }}
        >
          Create token accounts
        </AsyncButton>
      )}
    </>
  );
};
