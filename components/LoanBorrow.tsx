import React, { useEffect, useState } from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import * as styles from './Slider/Slider.css';
import ToggleSwitchLoan from '../components/ToggleSwitchLoan';
import { useBorrowPositions, depositNFT, withdrawNFT, useMarket, borrow, repay } from '@honey-finance/sdk';
import ConfigureSDK from '../helpers/config';

type TButton = {
    title: string;
    hidden?: boolean;
    onClick?: void;
};


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
    buttons: TButton[],
    handleBorrow: () => void,
    loanPositions?: number
}

const LoanBorrow = (props: LoanBorrowProps) => {
    const { NFT, buttons, handleBorrow } = props;
    const sdkConfig = ConfigureSDK();

    /**
        * @description calls upon useBorrowPositions
        * @params connection && wallet && HONEY_PROGRAM_ID
        * @returns loading state | NFTs posted as collateral | loan positions | error
    */
    let { loanPositions } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);

    const [lP, updateLp] = useState<number>(0)

    /**
     * @TODO when loading state is true show loader in NFTs block
     */
    useEffect(() => {
        if (loanPositions) {
            updateLp(loanPositions[0].amount)
        }
    }, [loanPositions])

    function handleWithdraw() {
        console.log('handle withdraw function')
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
                            {NFT.borrowApy}
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
                            {lP}
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
                            {NFT.assetsBorrowed} SOL
                            </Text>
                        </Stack>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        {NFT.assetsBorrowed}
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
            <ToggleSwitchLoan
                  buttons={[
                    {
                      title: 'Borrow',
                      onClick: () => handleBorrow()
                    }
                  ]}
                  activeIndex={0}
            />
        </Box>
    )
}

export default LoanBorrow;