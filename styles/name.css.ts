import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'degen';

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
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  '@media': {
    'screen and (min-width: 860px)': {
      // gridTemplateColumns: '2fr 1fr',
      flexDirection: 'row'
    }
  }
});

export const flexContainer = style({});

globalStyle(`${flexContainer} > div div`, {
  justifyContent: 'space-between'
});
