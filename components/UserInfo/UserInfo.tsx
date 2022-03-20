import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  MutableRefObject
} from 'react';
import { Box, IconMenu } from 'degen';
import { Stack } from 'degen';
import { Button } from 'degen';
import { Text } from 'degen';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import * as styles from './UserInfo.css';

interface UserInfoProps {
  setShowMobileSidebar: Function;
}

const UserInfo = (props: UserInfoProps) => {
  const { disconnect } = useSolana();
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnTextRef = useRef<HTMLElement>(null);
  const walletAddress = wallet?.publicKey.toString();

  useEffect(() => {
    const btn = btnRef.current;
    if (!btnTextRef.current || !btn || !walletAddress) return;
    btn.addEventListener('mouseenter', e => {
      if (!btnTextRef.current) return;
      btnTextRef.current.innerHTML = 'Disconnect';
    });

    btn.addEventListener('mouseleave', e => {
      if (!btnTextRef.current) return;
      btnTextRef.current.innerHTML = walletAddress || '';
    });
    return () => {
      btn?.removeEventListener('mouseenter', () => {});
      btn?.removeEventListener('mouseleave', () => {});
    };
  }, [walletAddress]);

  return (
    <Box
      borderRadius="large"
      height="16"
      backgroundColor="background"
      className={styles.topbar}
    >
      <Stack
        flex={1}
        direction="horizontal"
        space="3"
        justify="flex-end"
        align="center"
      >
        <Box marginRight="auto" className={styles.menuIcon}>
          <Button
            onClick={() => props.setShowMobileSidebar(true)}
            variant="transparent"
            shape="square"
            size="small"
          >
            <IconMenu size="8" color="accent" />
          </Button>
        </Box>
        {wallet ? (
          <Button
            onClick={disconnect}
            ref={btnRef}
            variant="secondary"
            size="small"
            width="48"
          >
            <Box width="24">
              <Text ref={btnTextRef} ellipsis>
                {wallet?.publicKey?.toString()}
              </Text>
            </Box>
          </Button>
        ) : (
          <Button variant="primary" size="small" width="48" onClick={connect}>
            Connect Wallet
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default UserInfo;
