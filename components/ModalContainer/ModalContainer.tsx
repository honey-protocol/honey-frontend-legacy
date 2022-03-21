import { Box, Card } from 'degen';
import React, { ReactNode } from 'react';
import * as styles from './ModalContainer.css';

const ModalContainer = (props: { children: ReactNode }) => {
  return (
    <Box
      className={styles.modalContainer}
      position="fixed"
      top="0"
      left="0"
      height="viewHeight"
      width="viewWidth"
    >
      <Card borderRadius="extraLarge">{props.children}</Card>
    </Box>
  );
};

export default ModalContainer;
