import { Box, Button, Input, Stack, Text } from 'degen';
import React from 'react';

const VeHoneyModal = () => {
  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Get veHONEY
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Text align="center" weight="semiBold">
            Deposit pHONEY and recieve veHONey
          </Text>
          <Box
            marginX="auto"
            borderColor="accent"
            borderWidth="0.375"
            height="7"
            borderRadius="large"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3/4"
          >
            <Text variant="small" color="accent">
              10 pHONEY = 3.142 veHONEY
            </Text>
          </Box>
          <Stack space="2">
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your veHoney deposited
              </Text>
              <Text variant="small">332,420</Text>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Your pHONEY balance
              </Text>
              <Text variant="small">332,420</Text>
            </Stack>
          </Stack>
          <Input type="number" label="Amount" hideLabel placeholder="0" />
          <Button width="full">Deposit</Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default VeHoneyModal;
