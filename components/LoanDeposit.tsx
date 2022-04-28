import React, {useState, useEffect} from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';
import ToggleSwitchLoan from '../components/ToggleSwitchLoan';  

type TButton = {
    title: string;
    hidden?: boolean;
    onClick?: void;
};
interface LoanDepositProps {
    borrowApy: number,
    estValue: number,
    assetsBorrowed: number,
    netBorrowBalance: number,
    buttons: TButton[],
    solAmount: number,
    handleDeposit: () => void
}

const LoanDeposit = (props: LoanDepositProps) => {
    const {
        borrowApy,
        estValue,
        assetsBorrowed,
        netBorrowBalance,
        buttons,
        solAmount,
        handleDeposit
    } = props;
    
    return (
        <Box gap="3" className={loanStyles.mainComponentWrapper} paddingBottom="min">
            <Stack align="center">
                <Box className={loanStyles.avatarWrapper}>
                    <Avatar label="" size="10" src={"/nfts/2738.png"} />
                    <Text
                        align="right"
                        weight="semiBold"
                        color="foreground"
                        variant="large"
                    >
                        Cofre
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
                        color="textSecondary">Supply APY</Text>
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
                        color="textSecondary">Your deposit</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            {/* Borrowed amount and currency */}
            <Box className={styles.selectionWrapper}>
                <Box>
                    <Button size="small" variant="secondary">Max</Button>
                </Box>
                <Box className={styles.selectionDetails}>
                    <div className={styles.currencyStyles}>{solAmount}</div>
                    <Avatar label="TetranodeNFT" size="10" shape="square" src={'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422'} />
                    <select name="currencySelector" id="currencySelector" className={styles.currencySelector}>
                        <option value="SOL">SOL</option>
                        {/* <option value="SOL">SOL</option>
                        <option value="ETH">ETH</option> */}
                    </select>
                </Box>
            </Box>
            <Box
                height="16"
                paddingTop="4"
            >
                <ToggleSwitchLoan
                  buttons={[
                    {
                      title: 'Deposit',
                      onClick: () => handleDeposit()
                    }
                  ]}
                  activeIndex={0}
                />
            </Box>
        </Box>
    )
}

export default LoanDeposit;