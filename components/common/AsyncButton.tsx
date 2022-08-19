import type { GokiSDK } from '@gokiprotocol/client';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { Button } from 'degen';
import { Props as ButtonProps } from 'degen/dist/types/components/Button';

import { useSDK } from 'helpers/sdk';

interface Props extends Omit<ButtonProps, 'onClick'> {
  onClick?: (sdkMut: GokiSDK) => Promise<void> | void;
  connectWalletOverride?: string;
}

export const AsyncButton: React.FC<Props> = ({
  onClick,
  children,
  connectWalletOverride,
  tone,
  ...rest
}: Props) => {
  const { connect } = useWalletKit();
  const { sdkMut } = useSDK();
  return sdkMut !== null ? (
    <Button
      size="small"
      variant="primary"
      width="full"
      onClick={
        onClick
          ? async () => {
              await onClick(sdkMut);
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Button>
  ) : (
    <Button
      size="small"
      variant="tertiary"
      width="full"
      {...rest}
      disabled={false}
      onClick={() => connect()}
    >
      {connectWalletOverride ?? 'Connect TEST'}
    </Button>
  );
};
