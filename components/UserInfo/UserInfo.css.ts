import { style } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const topbar = style([
  sprinkles({
    paddingX: 'medium'
  }),
  {
    display: 'flex'
  }
]);

export const menuIcon = style([
  sprinkles({
    display: {
      mobile: 'block',
      tablet: 'block',
      desktop: 'none'
    }
  })
]);
