import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const liquidationWrapper = style({
  color: 'white'
});

globalStyle(`${liquidationWrapper} > *`, {
  
});

export const subWrapper = style({
  background: 'rgb(30, 30, 30)',
  margin: '.75em 0',
  padding: '1em',
  borderRadius: '1em',
  verticalAlign: 'center',
});

globalStyle(`${subWrapper} > div > div`, {
  alignSelf: 'center'
})

export const subContainer = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%'
});

globalStyle(`${subContainer} > div`, {
  flex: '1 1 0px',
  textAlign: 'center'
});

globalStyle(`${subContainer} button`, {
  margin: '0 auto'
});

export const imageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const healthFactor = style({
  width: '5em'
});

globalStyle(`${healthFactor} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'rgb(48, 208, 88) !important',
  padding: '0.25em',
  background: 'rgb(26, 58, 34)',
  borderRadius: '10px',
  margin: '0 auto'
})