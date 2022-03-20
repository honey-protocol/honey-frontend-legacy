import { style } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const collectionCardsContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: vars.space.medium,

  '@media': {
    'screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr 1fr'
    },
    'screen and (max-width: 600px)': {
      gridTemplateColumns: '1fr'
    }
  }
});

export const searchContainer = style({
  marginLeft: 'auto',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '100%'
    }
  }
});
