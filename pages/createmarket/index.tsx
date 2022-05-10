import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack, IconSearch, Input } from 'degen';
import { Button, IconChevronLeft, vars } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/createMarket.css';

interface CreateMarketProps {
  setRenderCreateMarket: (value: number) => void;
}

const CreateMarket = (props: CreateMarketProps) => {
  const {setRenderCreateMarket} = props;

  return (
    <Stack>
      <Box className={styles.poolsWrapper}>
          <Stack
            direction="horizontal"
            justify="space-between"
            wrap
            align="center"
          >
            <Box display="flex" alignSelf="center" justifySelf="center">
              <Link href="/loan" passHref>
                <Button
                  size="small"
                  variant="transparent"
                  rel="noreferrer"
                  prefix={<IconChevronLeft />}
                  onClick={() => setRenderCreateMarket(0)}
                >
                  Pools
                </Button>
              </Link>
            </Box>
        </Stack>
      </Box>
      <Box className={styles.createMarketContainer}>
          Create Market Template
      </Box>
    </Stack>
  );
};

export default CreateMarket;
