import React, { FC, ReactNode } from 'react';
import { Box, Tag } from 'degen';
import { Stack } from 'degen';
import { Text } from 'degen';
import { Avatar } from 'degen';
import { Card } from 'degen';
// import Countdown from 'react-countdown';
import NumberFormat from 'react-number-format';
import getCollectionExpireDate from 'helpers/gemFarm';
import * as styles from './FarmCollectionCard.css';

// TODO: Uncomment bellow code to make component accept props

// interface Props {
//     data: ReactNode;
// }

// const StakedCollectionCard: FC<Props> = ({ data }) => {
const FarmCollectionCard = (props: any) => {
  const stringifiedData = JSON.stringify(props);
  const newFarmData = JSON.parse(stringifiedData);

  const expireDate = getCollectionExpireDate(
    newFarmData.data.eventStartDate,
    newFarmData.data.eventDuration
  );

  return (
    <Box
      backgroundColor="backgroundTertiary"
      padding="5"
      borderRadius="2xLarge"
      width="full"
      className={styles.cardContainer}
    >
      <Stack>
        <Box paddingBottom="3">
          <Stack justify="space-between" align="center" direction="horizontal">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
              space="2"
            >
              <Avatar
                label="TetranodeNFT"
                size="10"
                src={newFarmData.data.imageUrl}
              />
              <Box>
                <Text
                  weight="semiBold"
                  variant="large"
                  ellipsis
                  lineHeight="none"
                  whiteSpace="pre-wrap"
                >
                  <div
                    className={styles.cardTitle}
                    title={newFarmData.data.name}
                  >
                    {' '}
                    {newFarmData.data.name}
                  </div>
                </Text>
              </Box>
            </Stack>
            <Tag tone="accent">V3</Tag>
          </Stack>
        </Box>
        <Stack>
          <Stack direction="horizontal" align="center" justify="space-between">
            <Text
              size="small"
              align="left"
              weight="normal"
              color="textTertiary"
            >
              Rewards per NFT:
            </Text>
            <Text align="right" weight="medium" whiteSpace="pre-wrap">
              {newFarmData.data.allocation}
              {'\n'}${newFarmData.data.rewardTokenName}/day
            </Text>
          </Stack>
          <Stack direction="horizontal" align="center" justify="space-between">
            <Text
              size="small"
              align="left"
              weight="normal"
              color="textTertiary"
            >
              Event duration:
            </Text>
            <Text align="right" weight="medium">
              {newFarmData.data.eventDuration} days
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FarmCollectionCard;
