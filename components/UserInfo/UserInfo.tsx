import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconMenu } from 'degen';
import { Stack } from 'degen';
import { Button } from 'degen';
import { Text } from 'degen';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import * as styles from './UserInfo.css';

interface UserInfoProps {
  setShowMobileSidebar: Function;
}

const UserInfo = (props: UserInfoProps) => {
  const {
    disconnect,
  } = useSolana();

  const wallet = useConnectedWallet();

  const { connect } = useWalletKit();

  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  function useHover<T>(): [MutableRefObject<T>, boolean] {
    const [value, setValue] = useState<boolean>(false);

    // Wrap in useCallback so we can use in dependencies below
    const handleMouseOver = useCallback(() => setValue(true), []);
    const handleMouseOut = useCallback(() => setValue(false), []);

    // Keep track of the last node passed to callbackRef
    // so we can remove its event listeners.
    const ref = useRef();

    const callbackRef = useCallback(
      node => {
        if (ref.current) {
          ref.current.removeEventListener("mouseover", handleMouseOver);
          ref.current.removeEventListener("mouseout", handleMouseOut);
        }

        ref.current = node;

        if (ref.current) {
          ref.current.addEventListener("mouseover", handleMouseOver);
          ref.current.addEventListener("mouseout", handleMouseOut);
        }
      },
      [handleMouseOver, handleMouseOut]
    );
    return [callbackRef, value];
  }

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
          <Button variant="secondary" size="small" width="48">
            <Box
              width="24"
              onClick={disconnect}
              ref={hoverRef}
              >
              <Text ellipsis>
                {isHovered ? "Disconnect" : wallet?.publicKey?.toString()}
              </Text>
            </Box>
          </Button>
          ) : (
            <Button
              variant="primary"
              size="small"
              width="48"
              onClick={connect}>
                Connect Wallet
            </Button>
          )}
      </Stack>
    </Box>
  );
};

export default UserInfo;
