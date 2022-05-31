import { style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const actionTypeSelect = style({
  background: vars.colors.background,
  padding: '15px',
  borderRadius: vars.radii.extraLarge,
  color: vars.colors.text
});
