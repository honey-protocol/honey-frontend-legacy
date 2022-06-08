import { style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const dropdown = style({
  width: '100%',
  position: 'relative',
  borderWidth: '2px',
  borderRadius: vars.radii['2xLarge'],
  cursor: 'pointer',
  color: vars.colors.text
});

export const dropdownFilterSelected = style({
  padding: '15px 20px'
});

export const dropdownSelect = style({
  position: 'absolute',
  left: '0',
  top: 'calc(100% + 5px)',
  width: '100%',
  listStyle: 'none',
  background: vars.colors.backgroundSecondary,
  borderRadius: vars.radii['2xLarge'],
  margin: '0',
  padding: '0',
  borderWidth: '2px',
  overflow: 'hidden',
  transitionDuration: '0.5s',
  cursor: 'pointer'
});

export const dropdownSelectOption = style({
  padding: '12px 20px',
  cursor: 'pointer',
  borderBottomWidth: '1.5px',
  borderBottomColor: vars.colors.foregroundSecondary,
  transitionDuration: '.5s',
  ':last-child': {
    borderBottomWidth: 0
  },
  ':hover': {
    background: vars.colors.background
  }
});
