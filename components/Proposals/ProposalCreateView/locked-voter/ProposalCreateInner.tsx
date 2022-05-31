import { useMemo, useState } from 'react';
import {
  extractErrorMessage,
  useAccountData,
  useTXHandlers
} from '@saberhq/sail';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Textarea,
  Text,
  Stack
} from 'degen';

import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { ProposalConfirmModal } from './ProposalConfirmationModal';
import { ProposalTXForm } from './ProposalTxForm/ProposalTXForm';
import { HelperCard } from 'components/common/HelperCard';
import { AsyncButton } from 'components/AsyncButton';

export const ProposalCreateInner: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [discussionLink, setDiscussionLink] = useState<string>('');
  const [txRaw, setTxRaw] = useState<string>('');
  const [theError, setError] = useState<string | null>(null);
  const { minActivationThreshold, manifest } = useGovernor();
  const { signAndConfirmTX } = useTXHandlers();

  const proposalCfg = manifest?.proposals;
  const discussionRequired = !!proposalCfg?.discussion?.required;

  const { tx, error: parseError } = useMemo(() => {
    try {
      const buffer = Buffer.from(txRaw, 'base64');
      const tx = Transaction.from(buffer);
      if (tx.instructions.length === 0) {
        return { error: 'Transaction cannot be empty' };
      }
      return { tx };
    } catch (e) {
      return {
        error: extractErrorMessage(e)
      };
    }
  }, [txRaw]);

  const error =
    discussionRequired && !discussionLink
      ? 'Discussion link is required'
      : proposalCfg?.discussion?.prefix &&
        !discussionLink.startsWith(proposalCfg.discussion.prefix)
      ? 'Invalid discussion link'
      : theError ?? parseError;

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { ownerInvokerKey } = useExecutiveCouncil();

  // check to see if the payer is involved
  // if so, we should be showing the funding button
  const payerMut =
    !!ownerInvokerKey &&
    !!tx?.instructions
      .flatMap(ix => ix.keys)
      .find(
        meta =>
          meta.pubkey.equals(ownerInvokerKey) &&
          meta.isWritable &&
          meta.isSigner
      )
      ? ownerInvokerKey
      : null;

  const { data: payerMutData } = useAccountData(payerMut);
  const currentPayerBalance =
    payerMutData === undefined
      ? undefined
      : (payerMutData?.accountInfo.lamports ?? 0) / LAMPORTS_PER_SOL;

  return (
    <>
      <ProposalConfirmModal
        isOpen={showConfirm}
        onDismiss={() => {
          setShowConfirm(false);
        }}
        proposal={{
          title,
          description: discussionLink
            ? `${description}\n\n[View Discussion](${discussionLink})`
            : description,
          instructions: tx?.instructions ?? []
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        gap="8"
        // tw="flex flex-col gap-8 md:grid"
        // css={css`
        //   grid-template-columns: 400px 1fr;
        // `}
      >
        <Stack space="12">
          <Card level="2" padding="10">
            {/* <HelperCard variant="muted"> */}
            <Stack space="3">
              <Box as="p" color="white" marginBottom="2">
                Please take note of the following before creating a draft proposal:
              </Box>
              <Text as="p">
                1) Please make sure to start a discussion on the forum to see if there is sufficient support for your proposal.<br />
                <br />
                2) Draft proposals can only be activated by a DAO member with at least 1,000,000 $honey, all members of the DAO may vote to execute or reject the proposal.<br />
                <br />
                3) For a proposal to be executed there should be a minimum of 50,000,000 $honey votes casted resulting in at least 2/3 of the votes for one option.
              </Text>
            </Stack>
          </Card>
          <Card level="2">
            <Box display="grid" gap="4" padding="10">
              {/* <label tw="flex flex-col gap-1" htmlFor="title">
                <span tw="text-sm">Title (max 140 characters)</span> */}
              <Input
                label="Title (max 140 characters)"
                id="title"
                placeholder="A short summary of your proposal."
                value={title}
                maxLength={140}
                onChange={e => setTitle(e.target.value)}
              />
              {/* </label> */}
              {/* <label tw="flex flex-col gap-1" htmlFor="description"> */}
              {/* <span tw="text-sm">Description (max 750 characters)</span> */}
              <Textarea
                label="Description (max 750 characters)"
                id="description"
                rows={4}
                maxLength={750}
                placeholder={`## Summary\nYour proposal will be formatted using Markdown.`}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              {/* </label> */}
              {proposalCfg?.discussion?.required && (
                <Textarea
                  // Component={InputText}
                  id="discussionLink"
                  required
                  label="Link to discussion (required)"
                  placeholder={`URL must start with "${
                    proposalCfg?.discussion.prefix ?? ''
                  }"`}
                  // type="text"
                  value={discussionLink}
                  onChange={e => setDiscussionLink(e.target.value)}
                  error={
                    !discussionLink.length
                      ? undefined
                      : !discussionLink.startsWith(
                          proposalCfg.discussion.prefix ?? ''
                        )
                      ? 'Invalid discussion link'
                      : undefined
                  }
                  // touched={true}
                />
              )}
            </Box>
          </Card>
          <Box display="flex" flexDirection="column" gap="4">
            <Card padding="10" level="2">
              <Text size="extraLarge">Proposal Action</Text>
              <Box display="grid" gap="4" marginTop="10">
                <ProposalTXForm
                  setError={setError}
                  txRaw={txRaw}
                  setTxRaw={setTxRaw}
                />
              </Box>
            </Card>
            <Box display="flex" gap="4">
              {payerMut &&
                currentPayerBalance !== undefined &&
                currentPayerBalance < 0.5 && (
                  <AsyncButton
                    width="full"
                    // tw="flex-1"
                    size="medium"
                    onClick={async ({ provider }) => {
                      await signAndConfirmTX(
                        provider.newTX([
                          SystemProgram.transfer({
                            fromPubkey: provider.walletKey,
                            toPubkey: payerMut,
                            lamports: LAMPORTS_PER_SOL
                          })
                        ])
                      );
                    }}
                  >
                    <Box display="flex" flexDirection="column">
                      <span>Fund with 1 SOL</span>
                      <Text as="span" size="small">
                        (payer balance: {currentPayerBalance.toLocaleString()}{' '}
                        SOL)
                      </Text>
                    </Box>
                  </AsyncButton>
                )}
              <Button
                // tw="flex-1"
                // size="md"
                type="button"
                disabled={!(tx && title && description) || !!error}
                variant="primary"
                onClick={() => {
                  setShowConfirm(true);
                }}
              >
                {error ? error : 'Preview Proposal'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
