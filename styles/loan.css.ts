import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

// export const vaultsList = style({
//   overflowX: 'hidden',
//   overflowY: 'auto',
//   maxHeight: '250px'
// });

export const dataContainer = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1em'
});

export const dataRowWrapper = style({
  width: '100%',
  display: 'flex',
})

globalStyle(`${dataRowWrapper} > div`, {
  width: '100%',
  justifyContent: 'space-around',
});

globalStyle(`${dataRowWrapper} > div > *`, {
  width: '20%',
  textAlign: 'center',
  display: 'block'
});

globalStyle(`${dataRowWrapper} > div > div > div > span`, {
  display: 'block',
  textAlign: 'center'
});

export const avatarContainer = style({
  display: 'flex!important',
  flexDirection: 'row',
  alignItems: 'center'
})

globalStyle(`${avatarContainer} > div`,  {
  width: 'auto'
})

