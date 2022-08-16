import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'degen';
import { sprinkles } from '../../styles/theme.css';

export const topbar = style({
  display: 'flex',
  gap: vars.space[5],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: vars.radii.large,
  background: vars.colors.background
});

export const topbarContainer = style({
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '@media': {
    'screen and (min-width: 570px)': {
      flexDirection: 'row',
      width: '100%'
    }
  }
});

export const menuIcon = style([
  sprinkles({
    display: {
      mobile: 'block',
      tablet: 'block',
      desktop: 'none'
    }
  })
]);
