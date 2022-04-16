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

export const cardTitle = style({
  WebkitLineClamp: 1,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});
