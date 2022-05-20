import type { Interpolation, Theme } from '@emotion/react';
import { useState } from 'react';

import { AsyncButton } from './AsyncButton';
import { Modal } from '../Modal';
import { Box } from 'degen';

type Props = React.ComponentProps<typeof AsyncButton> & {
  modal: {
    title: string;
    disabled?: boolean;
    contents: React.ReactNode;
    style?: Interpolation<Theme>;
    innerStyles?: Interpolation<Theme>;
  };
};

export const AsyncConfirmButton: React.FC<Props> = ({
  children,
  onClick,
  modal: { title, contents, disabled, style: modalStyle, innerStyles },
  ...buttonProps
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <Modal
        isOpen={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}
        // css={modalStyle}
      >
        <Box
          borderBottomWidth="px"
          borderColor="black"
          color="white"
          fontSize="base"
          fontWeight="bold"
          textAlign="center"
          paddingY="4"
        >
          {title}
        </Box>
        <Box
          padding="8"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {contents}
          <Box marginTop="8" width="full">
            <AsyncButton {...buttonProps} disabled={disabled} onClick={onClick}>
              {title}
            </AsyncButton>
          </Box>
        </Box>
      </Modal>
      <AsyncButton
        {...buttonProps}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {children}
      </AsyncButton>
    </>
  );
};
