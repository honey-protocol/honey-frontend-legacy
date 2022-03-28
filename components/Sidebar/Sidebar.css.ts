import { style } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const sidebar = style({
  minHeight: '100vh',
  padding: vars.space.medium,
  position: 'sticky',
  top: '0',
  display: 'flex',
  width: '290px',
  '@media': {
    'screen and (max-width: 1020px)': {
      position: 'fixed',
      zIndex: 10,
      transition: 'all .4s',
      transform: 'translateX(-100%)'
    }
  }
});

export const sidebarMobile = style({
  '@media': {
    'screen and (max-width: 1020px)': {
      transform: 'translateX(0)'
    }
  }
});

export const bottomBox = style({
  marginBottom: vars.space.medium
});
