import Link from 'next/link';
import { mapSome, useTXHandlers } from '@saberhq/sail';
import { Box, Button, Text } from 'degen';
import Countdown from 'react-countdown';
// import invariant from 'tiny-invariant';
// import pluralize from 'pluralize';

import { useSDK } from 'helpers/sdk';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { useGokiTransactionData } from 'helpers/parser';
import { gokiTXLink, tsToDate } from 'helpers/utils';
// import { AsyncConfirmButton } from '../../../../../../common/AsyncConfirmButton';
// import { Card } from '../../../../../../common/governance/Card';
// import { ExternalLink } from '../../../../../../common/typography/ExternalLink';
// import { ProseSmall } from '../../../../../../common/typography/Prose';
import { ExecuteProposalButton } from 'components/GovernanceManageView/ExecutiveCouncilTab/ExecuteProposalButton';
import { Card } from 'components/common/governance/Card';

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalExecute: React.FC<Props> = ({
  proposal,
  onActivate
}: Props) => {
  const { sdkMut } = useSDK();
  const { governorW, smartWallet } = useGovernor();
  // const emergencyDAO = manifest?.addresses?.['emergency-dao']?.address;
  const { ecWallet, isMemberOfEC } = useExecutiveCouncil();
  const { data: gokiTransactionData } = useGokiTransactionData(
    proposal.proposalData.queuedTransaction
  );
  const { signAndConfirmTX } = useTXHandlers();

  if (!gokiTransactionData) {
    return <></>;
  }

  const votingEndedAt = tsToDate(proposal.proposalData.queuedAt);
  const eta = tsToDate(gokiTransactionData.account.eta);
  const gracePeriodEnd = mapSome(ecWallet.data, d =>
    !gokiTransactionData.account.eta.isNeg()
      ? tsToDate(gokiTransactionData.account.eta.add(d.account.gracePeriod))
      : null
  );

  const etaSurpassed = eta <= new Date();
  const gracePeriodSurpassed = mapSome(gracePeriodEnd, g => g <= new Date());

  return (
    <Card title="Execute Proposal">
      <Box paddingX="7" paddingY="4" fontSize="small">
        {/* <ProseSmall> */}
        <Box marginBottom="4">
          <Text as="p">
            The proposal was queued on{' '}
            <Text as="span" color="white">
              {votingEndedAt.toLocaleString(undefined, {
                timeZoneName: 'short'
              })}
            </Text>
            .
          </Text>
        </Box>
        {gracePeriodSurpassed ? (
          <Text as="p">
            The proposal execution period expired on{' '}
            {gracePeriodEnd?.toLocaleString(undefined, {
              timeZoneName: 'short'
            })}
            . This proposal may no longer be executed by the Executive Council.
          </Text>
        ) : etaSurpassed ? (
          <Text as="p">
            It may now be executed by any member of the{' '}
            <Link href={'details'}>Executive Council</Link> at any time before{' '}
            {gracePeriodEnd?.toLocaleString(undefined, {
              timeZoneName: 'short'
            })}
            .
          </Text>
        ) : (
          <Text as="p">
            It may be executed by any member of the{' '}
            <Link href={'details'}>Executive Council</Link> in{' '}
            <Countdown date={eta} />.
          </Text>
        )}
        <Box marginBottom="4">
          <Link href={gokiTXLink(gokiTransactionData.account)} passHref>
            <Button variant="transparent">View on Goki</Button>
          </Link>
        </Box>
        {/* </ProseSmall> */}
        {isMemberOfEC && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="8"
          >
            {/* {gracePeriodSurpassed && (
              <AsyncConfirmButton
                modal={{
                  title: 'Revive Proposal via Emergency DAO',
                  contents: (
                    <div tw="prose prose-light prose-sm">
                      <p>
                        You are about to propose the following{' '}
                        {pluralize(
                          'instruction',
                          gokiTransactionData.account.instructions.length
                        )}{' '}
                        on behalf of the emergency DAO:
                      </p>
                      <div>
                        <EmbedTX txKey={gokiTransactionData.publicKey} />
                      </div>
                    </div>
                  )
                }}
                disabled={!governorW || !ecWallet.data || !etaSurpassed}
                tw="w-3/4"
                variant="primary"
                onClick={async () => {
                  invariant(
                    governorW && sdkMut && smartWallet && ecWallet.data
                  );

                  const daoWallet = await sdkMut.loadSmartWallet(smartWallet);
                  const emergencyDAOWallet = await sdkMut.loadSmartWallet(
                    emergencyDAO
                  );

                  const { tx: innerTx } = await daoWallet.newTransaction({
                    proposer: emergencyDAOWallet.key,
                    instructions: proposal.proposalData.instructions.map(
                      ix =>
                        new TransactionInstruction({
                          ...ix,
                          data: Buffer.from(ix.data)
                        })
                    )
                  });
                  const { tx } = await emergencyDAOWallet.newTransaction({
                    instructions: innerTx.instructions
                  });
                  invariant(tx.instructions[0]);
                  await signAndConfirmTX(tx, `Revive Proposal`);
                }}
              >
                {!etaSurpassed ? (
                  <>
                    <Box marginRight="1">
                      <Text as="span">ETA in</Text>
                    </Box>
                    <Countdown date={eta} />
                  </>
                ) : (
                  'Revive Proposal via Emergency DAO'
                )}
              </AsyncConfirmButton>
            )} */}
            <ExecuteProposalButton
              tx={gokiTransactionData}
              onActivate={onActivate}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};
