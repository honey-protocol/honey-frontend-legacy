import { style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const cardContainer = style({
  transition: 'all .3s',
  boxSizing: 'border-box',
  borderWidth: 2,
  borderColor: 'transparent',
  ':hover': {
    borderColor: vars.colors.foregroundSecondary
  }
});
