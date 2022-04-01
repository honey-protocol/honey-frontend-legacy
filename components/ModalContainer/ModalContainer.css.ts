import { style } from '@vanilla-extract/css';

export const modalContainer = style({
  display: 'flex',
  position: 'fixed',
  opacity: '0',
  pointerEvents: 'none',
  overflow: 'auto',
  cursor: 'pointer',
  padding: '5rem 0px 0px',
  inset: '0',
  zIndex: '99',
  background:
    'linear-gradient(to right, rgba(var(--background), 0.5), rgba(var(--background), 0.5)),linear-gradient( to right, rgba(var(--foreground), 0.1), rgba(var(--foreground), 0.1) )',
  backdropFilter: 'blur(5px)',
  transform: 'translateZ(0px)',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all .3s'
});
