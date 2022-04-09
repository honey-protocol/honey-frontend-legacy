import { Box, Button, Stack, Text } from 'degen';
import React from 'react';

const SecPopup = (props: { setShowPopup: Function }) => {
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
          Please take caution when using honey.finance and other defi products
        </Text>
        <Text align="center" lineHeight="1.375">
          Persons accessing the website need to be aware that they are
          responsible for themselves for the compliance with all local rules and
          regulations
        </Text>
        <Text align="center" lineHeight="1.375">
          Honey finance is unavailable to residences of United States of America
        </Text>
      </Stack>
      <Box marginTop="7">
        <Button size="small" onClick={() => props.setShowPopup(false)}>
          I understand, proceed to the app
        </Button>
      </Box>
    </Box>
  );
};

export default SecPopup;
