import type { GokiSDK } from '@gokiprotocol/client';
import { useWalletKit } from '@gokiprotocol/walletkit';
import React from 'react';
import { Button } from 'degen';
import type { Props as ButtonProps } from 'degen/dist/types/components/Button';
import { useSDK } from 'helpers/sdk';

interface Props extends Omit<ButtonProps, 'onClick' | 'tone'> {
  onClick?: (sdkMut: GokiSDK) => Promise<void> | void;
  connectWalletOverride?: string;
}

export const AsyncButton: React.FC<Props> = ({
  onClick,
  children,
  connectWalletOverride,
  ...rest
}: Props) => {
  const { connect } = useWalletKit();
  const { sdkMut } = useSDK();
  return sdkMut !== null ? (
    <Button
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
    <Button {...rest} disabled={false} onClick={() => connect()}>
      {connectWalletOverride ?? 'Connect Wallet'}
    </Button>
  );
};
