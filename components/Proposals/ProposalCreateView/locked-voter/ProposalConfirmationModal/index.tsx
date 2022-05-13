import { useSail } from '@saberhq/sail';
import { buildStubbedTransaction } from '@saberhq/solana-contrib';
import { useSolana } from '@saberhq/use-solana';
import type { TransactionInstruction } from '@solana/web3.js';
import { GovernorWrapper } from '@tribecahq/tribeca-sdk';
import ReactMarkdown from 'react-markdown';
import invariant from 'tiny-invariant';

import { useSDK } from 'helpers/sdk';
import { useGovernor, useGovernorParams } from 'hooks/tribeca/useGovernor';
// import { notify } from '../../../../../../../utils/notifications';
import { HelperCard } from 'components/HelperCard';
import type { ModalProps } from 'components/Modal';
import { Modal } from 'components/Modal';
import { ModalInner } from 'components/Modal/ModalInner';
import { ProposalIX } from './ProposalIX';
import { useRouter } from 'next/router';
import { Box, IconLink, Text } from 'degen';

type Props = Omit<ModalProps, 'children'> & {
  proposal: {
    title: string;
    description: string;
    instructions: TransactionInstruction[];
  };
};

export const ProposalConfirmModal: React.FC<Props> = ({
  proposal,
  ...modalProps
}: Props) => {
  const { network } = useSolana();
  const { tribecaMut } = useSDK();
  const { governor, minActivationThreshold } = useGovernor();
  const { votingPeriodFmt } = useGovernorParams();
  const { handleTX } = useSail();
  const router = useRouter();

  const doProposeTransaction = async () => {
    invariant(tribecaMut);
    const gov = new GovernorWrapper(tribecaMut, governor!);
    const createProposal = await gov.createProposal({
      instructions: proposal.instructions
    });
    const createProposalMetaTX = await gov.createProposalMeta({
      proposal: createProposal.proposal,
      title: proposal.title,
      descriptionLink: proposal.description
    });
    for (const txEnv of [createProposal.tx, createProposalMetaTX]) {
      const { pending, success } = await handleTX(txEnv, 'Create Proposal');
      if (!success || !pending) {
        return;
      }
      await pending.wait();
    }
    // notify({
    //   message: `Proposal ${`000${createProposal.index.toString()}`.slice(
    //     -4
    //   )} created`
    // });
    router.push(`proposals/${createProposal.index.toString()}`);
    modalProps.onDismiss();
  };

  return (
    <Modal
      // tw="p-0 dark:text-white"
      {...modalProps}
    >
      <ModalInner
        title={
          <Text variant="large" ellipsis>
            Proposal: {proposal.title}
          </Text>
        }
        buttonProps={{
          disabled: !tribecaMut,
          variant: 'primary',
          onClick: doProposeTransaction,
          children: 'Propose Transaction'
        }}
      >
        <Box display="grid" paddingY="4" gap="4">
          <HelperCard>
            <Box marginBottom="1">
              <Text as="p">
                Tip: The proposal cannot be modified after submission, so please
                verify all information before submitting.
              </Text>
            </Box>
            <Text as="p">
              Once submitted, anyone with at least{' '}
              {minActivationThreshold?.formatUnits()} may start the voting
              period, i.e., activate the proposal. The voting period will then
              immediately begin and last for {votingPeriodFmt}.
            </Text>
          </HelperCard>
          <Box>
            <Text>
              <ReactMarkdown>{proposal.description}</ReactMarkdown>
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap="1.5">
            {proposal.instructions.map((ix, i) => (
              <ProposalIX key={i} ix={ix} />
            ))}
          </Box>
          {network !== 'localnet' && proposal.instructions.length > 0 && (
            <a
              // tw="text-sm text-primary hover:text-white transition-colors flex items-center gap-2"
              href={`https://${
                network === 'mainnet-beta' ? '' : `${network}.`
              }anchor.so/tx/inspector?message=${encodeURIComponent(
                buildStubbedTransaction(network, proposal.instructions)
                  .serializeMessage()
                  .toString('base64')
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="2"
                color={{ base: 'green', hover: 'white' }}
                fontSize="small"
              >
                <span>Preview on Anchor.so</span>
                <IconLink size="5" />
              </Box>
            </a>
          )}
        </Box>
      </ModalInner>
    </Modal>
  );
};
