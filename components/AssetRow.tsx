import React, { FC, ReactNode } from "react";
import { Box } from 'degen'
import { Stack } from 'degen'
import { Text } from 'degen'
import { Avatar } from 'degen'
import * as styles from '../styles/loan.css';
import { style } from '@vanilla-extract/css';

export interface AssetRowType {
    data?: ReactNode,
    vaultImageUrl: string,
    vaultName: string,
    totalBorrowed: number,
    interest: number,
    available: number,
    positions: number,
}
interface AssetRowProps {
    data: AssetRowType,
    openPositions?: number
}

const AssetRow = ({ data, openPositions }: AssetRowProps) => {
 return (
  <Box
    backgroundColor="foregroundSecondary"
    padding="5"
    borderRadius="2xLarge"
    className={styles.dataContainer}
  >
    <Stack
        direction="horizontal"
        justify="space-around"
        align="center"
    >
        <Box
            display="flex"
            className={styles.dataRowWrapper}
        >
            <Stack
                direction="horizontal"
                space="3"
                justify="center"
                align="center"
            >
                <Box className={styles.avatarContainer} >
                    {/* Implement next image https://degen-xyz.vercel.app/components/Avatar#next-image */}
                    <Avatar label="SMB" size="10" src={data.vaultImageUrl} />
                    <Text>{data.vaultName}</Text>
                </Box>
                <Box
                >
                    <Text align="center">
                        {data.totalBorrowed}
                    </Text>
                </Box>
                <Box
                >
                    <Text align="center" >
                        {data.interest}%
                    </Text>
                </Box>
                <Box
                >
                    <Text align="center" >
                        {data.available}
                    </Text>
                </Box>
                <Box
                >
                    <Text align="center" >{openPositions}</Text>
                </Box>
            </Stack>
        </Box>
    </Stack>
  </Box>
 )
}

export default AssetRow;