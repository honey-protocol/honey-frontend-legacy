import { style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const select = style({
  background: 'transparent',
  color: vars.colors.accent,
  padding: '3px 7px',
  borderColor: vars.colors.accent,
  borderRadius: vars.radii['large'],
  outline: 'none',
  cursor: 'pointer'
});
