import React, { FC, ReactNode } from 'react';
import { Box, Tag } from 'degen';
import { Stack } from 'degen';
import { Text } from 'degen';
import { Avatar } from 'degen';
import { Card } from 'degen';
// import Countdown from 'react-countdown';
import NumberFormat from 'react-number-format';
import getCollectionExpireDate from 'helpers/gemFarm';

// TODO: Uncomment bellow code to make component accept props

// interface Props {
//     data: ReactNode;
// }

// const StakedCollectionCard: FC<Props> = ({ data }) => {
const StakedCollectionCard = (props: any) => {
  const stringifiedData = JSON.stringify(props);
  const newFarmData = JSON.parse(stringifiedData);

  const expireDate = getCollectionExpireDate(
    newFarmData.data.eventStartDate,
    newFarmData.data.eventDuration
  );

  return (
    <Card level="2" hover padding="5" borderRadius="extraLarge" width="full">
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
                  {' '}
                  {newFarmData.data.name}
                </Text>
              </Box>
            </Stack>
            <Tag tone="accent">V3</Tag>
          </Stack>
        </Box>
        <Box>
          <Stack>
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Text
                size="small"
                align="left"
                weight="normal"
                color="textTertiary"
              >
                Allocation:
              </Text>
              <Text align="right" weight="medium">
                {newFarmData.data.allocation} $
                {newFarmData.data.rewardTokenName}/day
              </Text>
            </Stack>
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Text
                size="small"
                align="left"
                weight="normal"
                color="textTertiary"
              >
                Event duration
              </Text>
              <Text align="right" weight="medium">
                {newFarmData.data.eventDuration} days
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default StakedCollectionCard;
