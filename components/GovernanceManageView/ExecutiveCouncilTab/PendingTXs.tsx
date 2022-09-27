import { mapSome } from '@saberhq/sail';
import { tsToDate } from '@saberhq/solana-contrib';
import { Box } from 'degen';

import { useSmartWallet } from 'hooks/useSmartWallet';
// import { TableCardBody } from "../../../../../common/card/TableCardBody";
// import { EmptyState } from "../../../../../common/EmptyState";
// import { LoadingPage } from "../../../../../common/LoadingPage";
import { ExecuteProposalButton } from './ExecuteProposalButton';

export const PendingTXs: React.FC = () => {
  const { parsedTXs, smartWalletData } = useSmartWallet();

  const pendingTXs = parsedTXs?.filter(tx => {
    if (!tx.tx) {
      return false;
    }
    const gracePeriodEnd = mapSome(tx.tx, t =>
      mapSome(smartWalletData, d =>
        !t.account.eta.isNeg()
          ? tsToDate(t.account.eta.add(d.account.gracePeriod))
          : null
      )
    );
    if (gracePeriodEnd && gracePeriodEnd <= new Date()) {
      return false;
    }
    return tx.tx?.account.executedAt.isNeg() ?? false;
  });

  return (
    <Box width="full">
      <table>
        {pendingTXs?.map(tx => (
          <tr key={tx.tx.publicKey.toString()}>
            <td>TX-{tx.tx.account.index.toNumber()}</td>
            <td>{tx.instructions.map(ix => ix.title).join(', ')}</td>
            <td>
              <ExecuteProposalButton tx={tx.tx} />
            </td>
          </tr>
        ))}
      </table>
      {/* {pendingTXs?.length === 0 && (
        <EmptyState title="No pending transactions found." />
      )}
      {pendingTXs === undefined && <LoadingPage />} */}
    </Box>
  );
};
