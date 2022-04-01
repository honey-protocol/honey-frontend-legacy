import { style } from '@vanilla-extract/css';

export const cardContainer = style({
  width: '100%',
  display: 'flex',
  alignItems: 'stretch'
});

export const nftContainer = style({
  overflow: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gridGap: 13,
  '@media': {
    'screen and (max-width: 768px)': {}
  }
});

export const centerItemContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
});
