import { Box, Card } from 'degen';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import * as styles from './ModalContainer.css';

const ModalContainer = (props: {
  children: ReactNode;
  isVisible: boolean;
  onClose: Function;
}) => {
  const { isVisible, onClose } = props;
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(target => {
    if (!target) return;
    target.style.display = 'flex';
    target.style.zIndex = '99';

    // For modal to appear with transition
    setTimeout(() => {
      target.style.opacity = 1;
      target.style.pointerEvents = 'auto';
    }, 300);
  }, []);

  // opens modal when isVisible prop is true
  useEffect(() => {
    if (isVisible) {
      openModal(modalRef.current);
    }
  }, [isVisible, openModal, modalRef]);

  // closes the modal
  const closeModal = useCallback(
    target => {
      if (!target) return;
      target.style.opacity = 0;
      target.style.pointerEvents = 'none';
      target.style.zIndex = '0';

      // set display to none with timeout for modal to fade off and not just vanish
      setTimeout(() => {
        target.style.display = 'none';
        if (onClose) {
          onClose();
        }
      }, 300);
    },
    [onClose]
  );

  // onclicking bg, modal closes
  useEffect(() => {
    modalRef.current?.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target === modalRef.current) {
        closeModal(target);
      }
    });
    return () => {
      window.onclick = null;
    };
  }, [modalRef, closeModal]);

  return (
    <Box
      ref={modalRef}
      id="modal-container"
      className={styles.modalContainer}
      height="viewHeight"
      width="viewWidth"
    >
      <Card borderRadius="extraLarge">{props.children}</Card>
    </Box>
  );
};

export default ModalContainer;
