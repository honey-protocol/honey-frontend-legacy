import type { SmartWalletTransactionData } from '@gokiprotocol/client';
import { mapSome, useTXHandlers } from '@saberhq/sail';
import { tsToDate } from '@saberhq/solana-contrib';
import type { ProgramAccount } from '@saberhq/token-utils';
import pluralize from 'pluralize';
import Countdown from 'react-countdown';
import invariant from 'tiny-invariant';

import { useSDK } from 'helpers/sdk';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { AsyncConfirmButton } from 'components/common/AsyncConfirmButton';
// import { ProseSmall } from '../../../../../common/typography/Prose';
import { EmbedTX } from 'components/Proposals/ProposalIndexView/locked-voter/EmbedTX';
import { Box, Text } from 'degen';

interface Props {
  tx: ProgramAccount<SmartWalletTransactionData>;
  onActivate?: () => void;
}

export const ExecuteProposalButton: React.FC<Props> = ({
  tx,
  onActivate
}: Props) => {
  const { governorW, smartWallet } = useGovernor();
  const { ecWallet } = useExecutiveCouncil();
  const { sdkMut } = useSDK();
  const { signAndConfirmTX } = useTXHandlers();

  const eta = tsToDate(tx.account.eta);
  const gracePeriodEnd = mapSome(ecWallet.data, d =>
    !tx.account.eta.isNeg()
      ? tsToDate(tx.account.eta.add(d.account.gracePeriod))
      : null
  );

  const etaSurpassed = eta <= new Date();
  const gracePeriodSurpassed = !!mapSome(gracePeriodEnd, g => g <= new Date());

  const disabledReason = !governorW
    ? 'No governor'
    : !ecWallet.data
    ? 'No EC wallet'
    : !etaSurpassed
    ? 'ETA not surpassed'
    : gracePeriodSurpassed
    ? 'Grace period surpassed'
    : null;

  return (
    <AsyncConfirmButton
      modal={{
        title: 'Execute Proposal',
        // style: tw`max-w-4xl`,
        contents: (
          <Box>
            {/* <ProseSmall tw="text-center"> */}
            <Text as="p">
              You are about to execute the following{' '}
              {pluralize('instruction', tx.account.instructions.length)} on
              behalf of the DAO:
            </Text>
            {/* </ProseSmall> */}
            <Box width="full">
              <EmbedTX txKey={tx.publicKey} />
            </Box>
            <Box textAlign="center">
              <Text as="p">
                There will be two instructions for you to sign: the first is to
                approve the proposal for execution by the smart wallet, and the
                second is to execute the transaction on behalf of the smart
                wallet.
              </Text>
            </Box>
          </Box>
        )
      }}
      disabled={
        !governorW ||
        !ecWallet.data ||
        !etaSurpassed ||
        gracePeriodSurpassed ||
        !!disabledReason
      }
      // tw="w-3/4"
      variant="primary"
      onClick={async () => {
        invariant(governorW && sdkMut && smartWallet && ecWallet.data);
        const sw = await sdkMut.loadSmartWallet(ecWallet.data.publicKey);
        const [invoker] = await sw.findOwnerInvokerAddress(0);
        const invokeTX = await sw.ownerInvokeInstructionV2({
          instruction: sdkMut.programs.SmartWallet.instruction.approve({
            accounts: {
              smartWallet: smartWallet,
              transaction: tx.publicKey,
              owner: invoker
            }
          }),
          index: 0
        });
        await signAndConfirmTX(invokeTX, 'Approve Proposal');

        const executeTX = await (
          await sdkMut.loadSmartWallet(smartWallet)
        ).executeTransaction({
          transactionKey: tx.publicKey,
          owner: invoker
        });
        const executeIX = executeTX.instructions[0];
        invariant(executeIX, 'executed');
        const executeInvoke = await sw.ownerInvokeInstructionV2({
          instruction: executeIX,
          index: 0
        });

        await signAndConfirmTX(executeInvoke, 'Execute Proposal');
        onActivate?.();
      }}
    >
      {disabledReason ??
        (!etaSurpassed ? (
          <>
            <Box marginRight="1">
              <Text as="span">ETA in</Text>
            </Box>
            <Countdown date={eta} />
          </>
        ) : (
          'Execute Proposal'
        ))}
    </AsyncConfirmButton>
  );
};
