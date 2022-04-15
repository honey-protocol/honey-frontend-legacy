import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from 'degen';
import { sprinkles } from './theme.css';

export const chartArea = style({
  fontSize: '13px',
  color: vars.colors.text,
  fontFamily: vars.fonts.sans,
  width: '96%', //100% will cause the chart to act up. An issue with recharts
  height: 330,
  marginLeft: '2.5%'
});

export const actionModuleContainer = style({
  '@media': {
    'screen and (max-width: 1280px)': {
      order: -1
    }
  }
});
