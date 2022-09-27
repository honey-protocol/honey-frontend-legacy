import { useState } from 'react';

import type { ActionType } from 'actions/types';
import { ACTIONS } from 'actions/types';
import { useExecutiveCouncil } from 'hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { HelperCard } from 'components/common/HelperCard';
import { Box, Field, Spinner, Text } from 'degen';
// import { Select } from '../../../../../common/inputs/InputText';
// import { LoadingPage } from '../../../../../common/LoadingPage';
import * as styles from './ProposalTxForm.css';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown';

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
  const [actionType, setActionType] = useState<ActionType>('Memo');
  const { smartWallet, lockerData, governor, minter } = useGovernor();
  const { ownerInvokerKey } = useExecutiveCouncil();

  if (!smartWallet || !ownerInvokerKey) {
    return <Spinner />;
  }

  const actor = smartWallet;
  const ctx = { locker: lockerData?.publicKey, governor, minter };

  const currentAction = ACTIONS.find(action => action.title === actionType);

  return (
    <Box display="grid" gap="4" htmlFor="proposedAction">
      <Field label={<Text as="span">Proposed Action</Text>}>
        <CustomDropdown
          onChange={value => {
            setActionType(value as ActionType);
            setError(null);
            setTxRaw('');
          }}
          options={ACTIONS.map(({ title, isEnabled }) => {
            if (isEnabled && ctx && !isEnabled(ctx)) {
              return { title: '', value: '' };
            }
            return {
              title,
              value: title
            };
          })}
        />
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
