import { globalStyle, style } from '@vanilla-extract/css';

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
  '@media': {
    'screen and (min-width: 860px)': {
      // gridTemplateColumns: '2fr 1fr',
      flexDirection: 'row',
    }
  }
});

globalStyle(`${loanCardsContainer} div`, {
  margin: '0 0 .5em 0',
  '@media': {
    'screen and (min-width: 860px)': {
      // gridTemplateColumns: '2fr 1fr',
    }
  }
});

globalStyle(`${loanCardsContainer} div:first-of-type`, {
  '@media': {
    'screen and (min-width: 860px)': {
      marginRight: '.5em'
    }
  }
});

export const flexContainer = style({
});

globalStyle(`${flexContainer} > div div`, {
  justifyContent: 'space-between'
});