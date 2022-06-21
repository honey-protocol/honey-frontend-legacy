import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const liquidationWrapper = style({
  color: 'white'
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

export const healthFactorHigh = style({
  width: '5em'
});

globalStyle(`${healthFactorHigh} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'rgb(48, 208, 88) !important',
  padding: '0.5em',
  background: 'rgb(26, 58, 34)',
  borderRadius: '10px',
  margin: '0 auto'
});

export const healthFactorMedium = style({
  width: '5em'
});

globalStyle(`${healthFactorMedium} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'orange',
  padding: '0.5em',
  background: 'rgb(255, 215, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});

export const healthFactorLow = style({
  width: '5em'
});

globalStyle(`${healthFactorLow} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'red',
  padding: '0.5em',
  background: 'rgba(255, 0, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});

export const liquidationDetaiPageWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '66%',
  padding: '1em 0',
  borderRadius: '1em'
});

globalStyle(`${liquidationDetaiPageWrapper} div`, {
  flex: '1 1 0px',
});

export const liquidationDetaiPageWrapperImage = style({
});

globalStyle(`${liquidationDetaiPageWrapperImage} div`, {
  height: '10em',
  width: '10em'
});

export const buttonWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
})

globalStyle(`${buttonWrapper} button`, {
  margin: '1em 0',
  width: '45%'
})