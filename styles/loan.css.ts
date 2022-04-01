import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const vaultsList = style({
  overflowX: 'hidden',
  overflowY: 'auto',
  maxHeight: '250px'
});

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
});

globalStyle(`${avatarContainer} > div`,  {
  width: 'auto',
  marginRight: '.5em'
});

export const cardMenuContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 20px'
});

globalStyle(`${cardMenuContainer} > hr`, {
  width: '100%',
  color: 'white',
  display: 'block',
  height: '10px'
});

globalStyle(`${cardMenuContainer} > div`, {
  width: '20%',
  textAlign: 'center',
  display: 'block'
})

export const lineDivider = style({
  width: '100%'
});

// Styles for loan modal - should become a component in component folder with JSX and CSS logic
export const avatarWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '2em'
});

export const mainComponentWrapper = style({
  borderBottomLeftRadius: '1px',
  borderBottomRightRadius: '1px',
})

export const headerDivider = style({
  display: 'flex',
  flexDirection: 'row',
})

export const leftComponent = style({
  height: '8em',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around'
})

globalStyle(`${cardMenuContainer} > div`, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})