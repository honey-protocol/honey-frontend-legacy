import React, { FC, ReactNode } from "react";
import { Box } from 'degen'
import { Stack } from 'degen'
import { Text } from 'degen'
import { Avatar } from 'degen'
import { Card } from 'degen'
import NumberFormat from 'react-number-format';

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
}

const AssetRow = ({ data }: AssetRowProps) => {
 return (
  <Box
    backgroundColor="foregroundSecondary"
    padding="5"
    borderRadius="2xLarge"
  >
    <Stack
        direction="horizontal"
        justify="space-between"
        align="center"
    >
        <Box
            maxWidth="180"
        >
            <Stack
                direction="horizontal"
                space="3"
                justify="center"
                align="center"
            >
                {/* Implement next image https://degen-xyz.vercel.app/components/Avatar#next-image */}
                <Avatar label="TetranodeNFT" size="10" src={data.vaultImageUrl} />
                <Text>{data.vaultName}</Text>
            </Stack>
        </Box>
        <Box>
            <Text align="left" >
                <NumberFormat
                    value={data.totalBorrowed}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </Text>
        </Box>
        <Box>
            <Text align="left" >
                <NumberFormat
                    value={data.interest}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={'%'}
                />
            </Text>
        </Box>
        <Box>
            <Text align="left" >
                <NumberFormat
                    value={data.available}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </Text>
        </Box>
        <Box><Text align="left" >{data.positions}</Text></Box>
    </Stack>
  </Box>
 )
}

export default AssetRow;