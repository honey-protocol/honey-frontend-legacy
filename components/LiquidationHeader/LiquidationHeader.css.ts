import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const liquidationHeaderWrapper = style({
  color: 'white',
  fontSize: '1.2em',
  margin: '.75em 0',
  padding: '1em',
});

export const liquidationHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
});

globalStyle(`${liquidationHeaderContainer} > div`, {
  flex: '1 1 0px',
  textAlign: 'center'
})