import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const liquidationWrapper = style({
  color: 'white'
});

globalStyle(`${liquidationWrapper} > *`, {
  
});
