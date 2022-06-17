import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const liquidationHeaderWrapper = style({
  color: 'white',
  fontSize: '1.2em',
});

export const liquidationHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-around'
})