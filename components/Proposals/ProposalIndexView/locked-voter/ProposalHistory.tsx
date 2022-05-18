import type { SmartWalletTransactionData } from '@gokiprotocol/client';
import type { ProgramAccount } from '@saberhq/token-utils';
import type { ProposalData } from 'helpers/dao';
import {
  getProposalState,
  PROPOSAL_STATE_LABELS,
  ProposalState
} from 'helpers/dao';
import BN from 'bn.js';
import { startCase } from 'lodash';
import { Box, IconLink, Text } from 'degen';

import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { useGokiTransactionData } from 'helpers/parser';
import { Card } from 'components/common/governance/Card';

const ZERO = new BN(0);
interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

interface ProposalEvent {
  title: string;
  date: Date;
  link?: string | null;
}

export const makeDate = (num: BN): Date => new Date(num.toNumber() * 1_000);

const extractEvents = (
  proposalData: ProposalData,
  tx: ProgramAccount<SmartWalletTransactionData>
): ProposalEvent[] => {
  const events: ProposalEvent[] = [];
  if (!proposalData.canceledAt.eq(ZERO)) {
    events.push({ title: 'Canceled', date: makeDate(proposalData.canceledAt) });
  }
  if (!proposalData.activatedAt.eq(ZERO)) {
    events.push({
      title: 'Activated',
      date: makeDate(proposalData.activatedAt)
    });
  }
  if (!proposalData.createdAt.eq(ZERO)) {
    events.push({ title: 'Created', date: makeDate(proposalData.createdAt) });
  }
  if (!proposalData.queuedAt.eq(ZERO)) {
    events.push({
      title: 'Queued',
      date: makeDate(proposalData.queuedAt),
      link: tx
        ? `https://goki.so/#/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
        : null
    });
  }
  if (
    !proposalData.votingEndsAt.eq(ZERO) &&
    makeDate(proposalData.votingEndsAt) <= new Date()
  ) {
    // TODO: update quorum
    const state = getProposalState({ proposalData });
    events.push({
      title: startCase(
        PROPOSAL_STATE_LABELS[
          state === ProposalState.Queued ? ProposalState.Succeeded : state
        ]
      ),
      date: makeDate(proposalData.votingEndsAt)
    });
  }
  if (tx?.account.executedAt.gt(new BN(0))) {
    events.push({
      title: 'Executed',
      date: makeDate(tx.account.executedAt),
      link: tx
        ? `https://goki.so/#/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
        : null
    });
  }
  return events.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const ProposalHistory: React.FC<Props> = ({
  className,
  proposalInfo
}: Props) => {
  const { data: tx } = useGokiTransactionData(
    !proposalInfo?.proposalData.queuedAt.eq(ZERO)
      ? proposalInfo?.proposalData.queuedTransaction
      : null
  );
  const events =
    proposalInfo && tx ? extractEvents(proposalInfo.proposalData, tx) : [];
  return (
    <Card className={className} title="Proposal History">
      <Box display="grid" paddingX="7" paddingY="4" gap="4">
        {events.map(({ title, date, link }, i) => (
          <Box key={i}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" flexDirection="column" fontSize="small">
                <Text color="white">{title}</Text>
                <Text as="span" size="small">
                  {date.toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}{' '}
                  &mdash; {date.toLocaleTimeString()}
                </Text>
              </Box>
              {link && (
                <a
                  href={link}
                  // tw="text-primary hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconLink />
                </a>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
