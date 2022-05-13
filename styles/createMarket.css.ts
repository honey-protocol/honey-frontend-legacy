import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'degen';

export const createMarketContainer = style({
  borderRadius: vars.radii['2xLarge'],
  padding: vars.space[15],
  backgroundColor: vars.colors.background
});

export const tokenSelect = style({});

export const poolsWrapper = style({
  background: 'rgb(10,10,10)',
  padding: '2em 0',
  color: 'red'
});

globalStyle(`${createMarketContainer} > button `, {
  marginTop: '2em'
});

globalStyle(`${createMarketContainer} > form `, {
  display: 'flex',
  flexDirection: 'column'
});
