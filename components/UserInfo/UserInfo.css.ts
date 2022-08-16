import { globalStyle, style } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const topbar = style([
  sprinkles({
    paddingX: 'medium'
  }),
  {
    height: '12em'
  },
  {
    alignItems: 'center',
    padding: 0,
    justifyContent: 'center',
    display: 'flex'
  },
  {
    '@media': {
      'screen and (min-width: 570px)': {
        height: 'auto',

      }
    }
  }
]);

globalStyle(`${topbar} > div:first-of-type`, {
  height: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  padding: '.5em 0'
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

globalStyle(`${topbarContainer} > *`, {
  display: 'flex',
  margin: '0 auto',
  padding: '.5em',
  height: '2.5em',
  '@media': {
    'screen and (min-width: 570px)': {
      height: 'auto',
      padding: '.5em 0',
      margin: '0 auto',
    }
  }
});

globalStyle(`${topbarContainer} > * > button`, {
  margin: '0 auto',
});

globalStyle(`${topbarContainer} > div:first-of-type`, {
  '@media': {
    'screen and (min-width: 1021px)': {
      display: 'none!important'
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
  }),
]);
