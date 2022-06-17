import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';

interface LiquidationSubProps {
  loan: any;
}

const LiquidationSub = (props: LiquidationSubProps) => {
  const { loan } = props;

  return (
      <Box marginY="4">
        <Box>
          <Avatar
            label="" size="15" src={''}
          />
          <Text>{loan.title}</Text>
          <Text>{loan.debt}</Text>
          <Text>{loan.collateral}</Text>
          <Text>{loan.address}</Text>
          <Text>{loan.lr}</Text>
          <Text>{loan.ltv}</Text>
        </Box>
      </Box>
  );
};

export default LiquidationSub;