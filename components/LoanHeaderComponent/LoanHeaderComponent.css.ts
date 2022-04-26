import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'degen';

export const headerWrapper = style({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '20px',
  background: vars.colors.background,
  padding: '1em 3em',
  alignItems: 'center',
  borderRadius: vars.radii['2xLarge']
});

globalStyle(`${headerWrapper} > div `, {
  fontSize: '1em',
  fontWeight: 'bold',
  textAlign: 'center',
  lineHeight: '1.5em'
});

globalStyle(`${headerWrapper} > div > div > span `, {
  fontSize: '.8em',
  fontWeight: '600',
  color: 'rgb(48, 208, 88)',
  padding: '.25em',
  background: 'rgb(26, 58, 34)',
  borderRadius: '10px'
});
