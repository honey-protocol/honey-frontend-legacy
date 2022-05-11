import '@reach/dialog/styles.css';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import { animated, useSpring, useTransition } from '@react-spring/web';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useGesture } from 'react-use-gesture';

import { ModalProvider } from './context';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  darkenOverlay?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  children,
  isOpen,
  onDismiss,
  darkenOverlay = true
}: ModalProps) => {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: 150 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const [{ y }, set] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 210, friction: 20 }
  }));
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      });
      if (
        state.movement[1] > 300 ||
        (state.velocity > 3 && state.direction[1] > 0)
      ) {
        onDismiss();
      }
    }
  });

  return (
    <>
      {fadeTransition(
        (transition, item) =>
          item && (
            <StyledDialogOverlay
              style={transition}
              isOpen={isOpen || transition.opacity.get() !== 0}
              onDismiss={onDismiss}
              darkenOverlay={darkenOverlay}
            >
              <ModalWrapper
                className={className}
                aria-label="dialog content"
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.to(n => `translateY(${n > 0 ? n : 0}px)`)
                      }
                    }
                  : {})}
              >
                <ModalProvider initialState={onDismiss}>
                  {children}
                </ModalProvider>
              </ModalWrapper>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
};

const ModalWrapper = styled(animated(DialogContent))``;

// const ModalWrapper = styled(animated(DialogContent))`
//   ${tw`shadow-2xl w-full max-w-lg p-6 rounded-lg relative`}
//   ${tw`dark:(bg-warmGray-850)`}
// `;

const StyledDialogOverlay = styled(animated(DialogOverlay), {
  shouldForwardProp: prop => prop !== 'darkenOverlay'
})<{
  darkenOverlay: boolean;
}>`
  &[data-reach-dialog-overlay] {
    z-index: 11 !important;
  }
  [data-reach-dialog-content] {
    padding: 0;
  }
  ${({ darkenOverlay }) =>
    darkenOverlay
      ? css`
          background: rgba(0, 0, 0, 0.55);
        `
      : css`
          background: none;
        `}
`;
