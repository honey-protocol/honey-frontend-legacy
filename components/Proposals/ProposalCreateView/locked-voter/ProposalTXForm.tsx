import { useState } from 'react';

import type { ActionType } from 'actions/types';
import { ACTIONS } from 'actions/types';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { HelperCard } from 'components/common/HelperCard';
import { Box, Field, Spinner, Text } from 'degen';
// import { Select } from '../../../../../common/inputs/InputText';
// import { LoadingPage } from '../../../../../common/LoadingPage';

interface Props {
  txRaw: string;
  setError: (error: string | null) => void;
  setTxRaw: (txRaw: string) => void;
}

export const ProposalTXForm: React.FC<Props> = ({
  setError,
  txRaw,
  setTxRaw
}: Props) => {
  const [actionType, setActionType] = useState<ActionType>('Upgrade Program');
  const { smartWallet, lockerData, governor } = useGovernor();
  const { ownerInvokerKey } = useExecutiveCouncil();

  if (!smartWallet || !ownerInvokerKey) {
    return <Spinner />;
  }

  const actor = smartWallet;
  const ctx = { locker: lockerData?.publicKey, governor };

  const currentAction = ACTIONS.find(action => action.title === actionType);

  return (
    <Box display="grid" gap="4" htmlFor="proposedAction">
      <Field label={<Text as="span">Proposed Action</Text>}>
        <select
          value={actionType}
          onChange={e => {
            setActionType(e.target.value as ActionType);
            setError(null);
            setTxRaw('');
          }}
        >
          {ACTIONS.map(({ title, isEnabled }) => {
            if (isEnabled && ctx && !isEnabled(ctx)) {
              return null;
            }
            return (
              <option key={title} value={title}>
                {title}
              </option>
            );
          })}
        </select>
      </Field>
      {/* <label tw="flex flex-col gap-1" htmlFor="proposedAction">
        <select
          value={actionType}
          onChange={e => {
            setActionType(e.target.value as ActionType);
            setError(null);
            setTxRaw('');
          }}
        >
          {ACTIONS.map(({ title, isEnabled }) => {
            if (isEnabled && ctx && !isEnabled(ctx)) {
              return null;
            }
            return (
              <option key={title} value={title}>
                {title}
              </option>
            );
          })}
        </select>
      </label> */}
      {currentAction && (
        <>
          {currentAction.description && (
            <HelperCard>
              <Text>{currentAction.description}</Text>
            </HelperCard>
          )}
          <currentAction.Renderer
            actor={actor}
            payer={ownerInvokerKey}
            ctx={ctx}
            txRaw={txRaw}
            setError={setError}
            setTxRaw={setTxRaw}
          />
        </>
      )}
    </Box>
  );
};
