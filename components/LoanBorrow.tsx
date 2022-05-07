import React, { useEffect, useState } from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import * as styles from './Slider/Slider.css';

interface LoanBorrowProps {
    NFT: {
        name: string,
        image: string,
        borrowApy: string,
        estValue: string,
        assetsBorrowed: number,
        netBorrowBalance: number,
        key: number
    },
    executeBorrow: () => void;
    openPositions?:[];
    loanPositions: any;
}

const LoanBorrow = (props: LoanBorrowProps) => {
    const { NFT, executeBorrow, openPositions, loanPositions } = props;
    const [noPositions, setNoPositions] = useState('');
    const [currentLoanPosition, updateCurrentLoanPosition] = useState(0);

    useEffect(() => {
        if (loanPositions) {
            updateCurrentLoanPosition(loanPositions[0]?.amount)
        }
    }, [loanPositions]);

    function handleExecuteBorrow() {
        if (openPositions && openPositions.length > 0) {
            executeBorrow();
        } 
        setNoPositions('Please select an NFT to borrow against')
        return;

        // executeBorrow()
    }

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
                    <Avatar label="" size="10" src={NFT.image} />
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
                            {NFT.name}
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
                        <Text
                            align="left"
                            color="textSecondary">
                            Borrow APY
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            0%
                        </Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Estimated value</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            {NFT.estValue}
                        </Text>
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
                        <Text
                            align="left"
                            color="textSecondary">
                                Assets borrowed
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                             Lamports
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Stack direction="horizontal">
                            <Text
                                align="left"
                                color="foreground"
                            >
                            Lamports
                            </Text>
                        </Stack>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        {currentLoanPosition}
                    </Text>
                    </Stack>
                </Stack>
            </Box>
            <hr></hr>
            {/* Interest & payback data*/}
            <Box
                paddingTop="1"
                paddingBottom="3"
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
                        Net borrow balance
                    </Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        {NFT.netBorrowBalance}
                    </Text>
                </Stack>
            </Box>
            <Box>
                <Slider />
            </Box>
            {noPositions && 
                <Box className={styles.noPositions}>
                    Please select an NFT to borrow against
                </Box>
            }
            <Button width="full" onClick={handleExecuteBorrow}>Borrow</Button>
        </Box>
    )
}

export default LoanBorrow;