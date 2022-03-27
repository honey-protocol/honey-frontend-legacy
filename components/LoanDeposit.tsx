import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'

interface LoanDepositProps {
    borrowApy: number,
    estValue: number,
    assetsBorrowed: number,
    netBorrowBalance: number,
}

const LoanDeposit = (props: LoanDepositProps) => {
    const {
        borrowApy,
        estValue,
        assetsBorrowed,
        netBorrowBalance
    } = props;

    return (
        <Box gap="3">
            {/* Vault data row */}
            <Stack
                align="center"
            >
                <Box
                    paddingBottom="2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar label="" size="10" src={"/nfts/2738.png"} />
                    <Text
                        align="right"
                        weight="semiBold"
                        color="foreground"
                        variant="large"
                    >
                        NFT name #234
                    </Text>
                </Box>
            </Stack>
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
                        <Text
                            align="left"
                            color="textSecondary">
                            Total supply
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $2,402,540
                        </Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Supply API</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            12.2%
                        </Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Your deposit</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $4,500
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            {/* Borrowed amount and currency */}
            <Box
                paddingTop="5"
            >
            <Input
                hideLabel
                label="Amount"
                max={100}
                min={0}
                placeholder="20"
                type="number"
                units="SOL"
            />
            </Box>
            <Box
                height="16"
                paddingTop="4"
            >
                <Button width="full">Deposit</Button>
            </Box>
        </Box>
    )
}

export default LoanDeposit;