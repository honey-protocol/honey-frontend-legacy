import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'degen';
import { relative } from 'path';

export const toggleSwitch = style({
  position: 'relative',
  width: '60px',
  height: '28px',
  cursor: 'pointer'
});

export const input = style({
  opacity: 0,
  height: '100%',
  position: 'absolute',
  width: '100%',
  zIndex: '10'
});

export const slider = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: '0.4s',
  borderRadius: '34px',
  backgroundColor: vars.colors.foregroundSecondary
});

globalStyle(`${slider}:before`, {
  position: 'absolute',
  content: '',
  height: '20px',
  width: ' 20px',
  left: '4px',
  bottom: '4px',
  backgroundColor: 'white',
  transition: '0.4s',
  borderRadius: '50%'
});

globalStyle(`${input}:focus + ${slider}`, {
  boxShadow: '0 0 1px #f78437'
});

globalStyle(`${input}:checked + ${slider}:before`, {
  transform: 'translateX(30px)',
  background: vars.colors.accent
});
