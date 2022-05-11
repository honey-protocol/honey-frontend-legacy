import { ProposalState } from '@tribecahq/tribeca-sdk';
import { Box, Skeleton } from 'degen';
import React from 'react';

import { ProposalStateLabel } from './ProposalStateLabel';

export const PlaceholderCard: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="6"
      paddingY="7"
      borderLeftWidth="2"
      cursor="pointer"
      borderColor="transparent"
      borderBottomWidth="1"
    >
      <div>
        <Box display="flex" alignItems="center" height="5">
          <Skeleton loading height="3" backgroundColor="accentSecondary" />
        </Box>
        <PlaceholderSubtitle />
      </div>
    </Box>
  );
};

export const PlaceholderSubtitle: React.FC = () => (
  <Box display="flex" alignItems="center" marginTop="2" gap="2">
    <ProposalStateLabel state={ProposalState.Draft} />
    <Box display="flex" alignItems="center" gap="1">
      <Skeleton loading height="2" width="4" />
      <span>&middot;</span>
      <Skeleton loading height="2" width="20" />
    </Box>
  </Box>
);
