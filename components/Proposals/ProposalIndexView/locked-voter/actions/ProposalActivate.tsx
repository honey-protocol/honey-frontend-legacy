import { useSail, useTXHandlers } from '@saberhq/sail';
import { sleep } from '@saberhq/token-utils';
import { useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { Box, Spinner, Text, Button, Stack } from 'degen';

import { useUserEscrow } from 'hooks/tribeca/useEscrow';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { formatDurationSeconds } from 'helpers/format';
// import { Button } from '../../../../../../common/Button';
import { Card } from 'components/common/governance/Card';
import Link from 'next/link';
// import { LoadingPage } from '../../../../../../common/LoadingPage';

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalActivate: React.FC<Props> = ({
  proposal,
  onActivate
}: Props) => {
  const { minActivationThreshold, governorData } = useGovernor();
  const { data: escrow, veBalance, refetch } = useUserEscrow();
  const { handleTX } = useSail();
  const { governorW } = useGovernor();
  const { signAndConfirmTX } = useTXHandlers();

  const earliestActivationTime = useMemo(
    () =>
      governorData
        ? new Date(
            proposal.proposalData.createdAt
              .add(governorData.account.params.votingDelay)
              .toNumber() * 1_000
          )
        : null,
    [governorData, proposal.proposalData.createdAt]
  );

  useEffect(() => {
    if (!earliestActivationTime) {
      return;
    }
    const remainingTime = earliestActivationTime.getTime() - Date.now();
    const timeout = setTimeout(() => {
      void refetch();
    }, remainingTime + 1);
    return () => clearTimeout(timeout);
  }, [earliestActivationTime, refetch]);

  return (
    <Card title="Actions">
      <Box
        paddingX="7"
        paddingY="4"
        fontSize="small"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {!earliestActivationTime || !governorData ? (
          <Spinner />
        ) : earliestActivationTime > new Date() ? (
          <Box display="flex" flexDirection="column" gap="4">
            <Text as="p">
              You must wait{' '}
              {formatDurationSeconds(
                governorData.account.params.votingDelay.toNumber()
              )}{' '}
              for this proposal to be activated.
            </Text>
            <Text as="p">
              The proposal may be activated at{' '}
              {earliestActivationTime?.toLocaleString(undefined, {
                timeZoneName: 'short'
              })}{' '}
              by anyone who possesses at least{' '}
              {minActivationThreshold?.formatUnits()}.
            </Text>
          </Box>
        ) : minActivationThreshold &&
          veBalance?.greaterThan(minActivationThreshold) ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              disabled={!escrow}
              // tw="w-3/4 dark:text-white hover:dark:text-primary hover:dark:border-primary"
              variant="tertiary"
              onClick={async () => {
                invariant(escrow);
                const tx = escrow.escrowW.activateProposal(
                  proposal.proposalKey
                );
                await signAndConfirmTX(tx, 'Activate Proposal');
                await sleep(1_000);
                await refetch();
                onActivate();
              }}
            >
              Activate Proposal
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap="4">
            <Text as="p">
              You must have at least{' '}
              <strong>{minActivationThreshold?.formatUnits()}</strong> to
              activate this proposal for voting.
            </Text>
            {veBalance ? (
              <Text as="p">You currently have {veBalance?.formatUnits()}.</Text>
            ) : (
              <Text as="p">
                You currently don&apos;t have any tokens vote locked.
              </Text>
            )}
            <Box
              // as={Link}
              display="flex"
              alignItems="center"
              justifyContent="center"
              href="locker"
            >
              <Box width="3/4" marginTop="4" textAlign="center">
                <Button width="full" size="small">
                  Lock Tokens
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        <Box
          gap="2"
          marginTop="4"
          width="full"
          alignItems="center"
          flexDirection="column"
          display="flex"
        >
          {governorW &&
            proposal.proposalData.proposer.equals(
              governorW.provider.wallet.publicKey
            ) && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="3/4"
              >
                <Button
                  variant="tertiary"
                  width="full"
                  size="small"
                  onClick={async () => {
                    const tx = governorW.cancelProposal({
                      proposal: proposal.proposalKey
                    });
                    const handle = await handleTX(tx, 'Cancel Proposal');
                    if (!handle.pending) {
                      return;
                    }
                    await handle.pending.wait();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
        </Box>
      </Box>
    </Card>
  );
};
