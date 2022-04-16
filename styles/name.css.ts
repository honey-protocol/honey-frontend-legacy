import { style } from '@vanilla-extract/css';

export const cardsContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: 20,
  '@media': {
    'screen and (min-width: 860px)': {
      gridTemplateColumns: '1fr 1fr'
    }
  }
});

export const loanCardsContainer = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gridGap: 20,
  '@media': {
    'screen and (min-width: 860px)': {
      gridTemplateColumns: '2fr 1fr'
    }
  }
});
