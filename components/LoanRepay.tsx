import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';

interface LoanRepayProps {
    NFT: [{
        name: string,
        image: string,
        borrowApy: string,
        estValue: string,
        assetsBorrowed: number,
        netBorrowBalance: number,
        key: number
    }]
}

const LoanRepay = (props: LoanRepayProps) => {
    const { NFT } = props;
    const selected = NFT[0];

    return (
        <Box gap="3">
            {/* Vault data row */}
            <Stack
            justify="space-between"
            >
            <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
            >
                <Box alignItems="flex-start">
                    <Avatar label="" size="10" src={selected.image} />
                </Box>
                <Box
                paddingBottom="2"
                >
                <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                >
                    <Text
                    align="right"
                    weight="semiBold"
                    color="foreground"
                    variant="large"
                    >
                    {selected.name}
                    </Text>
                </Stack>
                <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                >
                    <Text align="right" color="textSecondary">Evaluation: </Text>
                    <Text
                    align="right"
                    color="foreground"
                    >
                    {selected.estValue}
                    </Text>
                </Stack>
                </Box>
            </Stack>
            </Stack>
            <hr></hr>
            {/* Liquidation and interest data */}
            <Box
            paddingTop="1"
            paddingBottom="1"
            >
            <Stack
                justify="space-between"
            >
                <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
                >
                <Text align="left"
                color="textSecondary">Liquidation threshold</Text>
                <Text
                    align="right"
                    color="foreground"
                >
                    15.5%</Text>
                </Stack>
                <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
                >
                <Text align="left"
                color="textSecondary">Interest rate</Text>
                <Text
                    align="right"
                    color="foreground"
                >
                    4.2%</Text>
                </Stack>
            </Stack>
            </Box>
            <hr></hr>
            {/* Assets borrowed */}
            <Box
                paddingTop="1"
                paddingBottom="1"
            >
                <Stack
                    justify="space-between"
                >
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                    <Text align="left"
                    color="textSecondary">Assets borrowed</Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        {selected.assetsBorrowed}</Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text
                            align="left"
                            color="foreground"
                            >
                            {selected.assetsBorrowed} USDC
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            {selected.assetsBorrowed}
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <hr></hr>
            {/* Interest & payback data*/}
            <Box
                paddingTop="1"
                paddingBottom="1"
            >
                <Stack
                    justify="space-between"
                >
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text align="left"
                            color="textSecondary">Total interest</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Total payback</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <Slider />
            <Button width="full">Repay</Button>
        </Box>
    )
}

export default LoanRepay;