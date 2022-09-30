import { Box } from 'degen';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { SmartWalletProvider } from 'hooks/useSmartWallet';
import { Card } from 'components/common/governance/Card';
import { PendingTXs } from './PendingTXs';

export const ExecutiveCouncilTab: React.FC = () => {
  const { smartWallet } = useGovernor();
  return (
    <SmartWalletProvider initialState={smartWallet ?? undefined}>
      <Box display="flex" flexDirection="column" gap="4">
        <Card title="Pending Transactions">
          <PendingTXs />
        </Card>
      </Box>
    </SmartWalletProvider>
  );
};
