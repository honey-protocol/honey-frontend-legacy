import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const createMarketContainer = style({
  display: 'flex',
  color: 'white',
  margin: '1em -1em',
  borderRadius: '18px',
  padding: '2em',
});

export const poolsWrapper = style({
  background: 'rgb(10,10,10)',
  padding: '2em 0',
  width: '103%',
  margin: '-1.2em',
  color: 'red'
});

globalStyle(`${poolsWrapper} > * `, {
});
