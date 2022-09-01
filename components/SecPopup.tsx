import { Box, Button, Stack, Text } from 'degen';
import React from 'react';

const SecPopup = (props: { setShowPopup: Function }) => {
  const onAgree = () => {
    localStorage.setItem('caution-agreed', 'true');
    props.setShowPopup(false);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="viewHeight"
      width="viewWidth"
      flexDirection="column"
      backgroundColor="background"
      padding="10"
    >
      <Stack align="center" justify="center">
        <Text align="center" color="textPrimary" as="h2" size="headingTwo">
          Honey Finance
        </Text>
        <Text align="center" lineHeight="1.375">
          This version is a first version demo running on devnet. Please setup your wallet and SOL accordingly.
        </Text>
        <Text align="center" lineHeight="1.375">
          If you have any feedback or encounter any bugs please reach out to us through the #feedback channel on Discord
        </Text>
        <Text variant="large" weight="bold" align="center" lineHeight="1.375">
          This is not production software use at your own risk.
        </Text>
      </Stack>
      <Box marginTop="7">
        <Button variant="secondary" size="small" onClick={onAgree}>
          I understand, proceed to the app
        </Button>
      </Box>
    </Box>
  );
};

export default SecPopup;
