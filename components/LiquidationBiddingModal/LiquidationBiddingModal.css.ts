import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const liquidationBiddingModalWrapper = style({
  width: '30em',
  height: '40em',
  background: 'rgb(30, 30, 30)',
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginLeft: '-15em',
  marginTop: '-20em',
  border: '2px solid black',
  borderRadius: '10px',
  color: 'white',
  padding: '2em',
});

globalStyle(`${liquidationBiddingModalWrapper} > div`, {
  margin: '2em 0',
  fontSize: '1.2em',
});

globalStyle(`${liquidationBiddingModalWrapper} > div > div`, {
  margin: '.5em 0',
});

export const bidWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

export const buttonWrapper = style({
  width: '100%',
  position: 'relative',
  bottom: '-10em'
});

globalStyle(`${buttonWrapper} > button`, {
  width: '100%',
});

export const inputWrapper = style({
  position: 'absolute',
  bottom: '4em',
  width: '86%',
  margin: '0',
  padding: '0'
});

globalStyle(`${inputWrapper} > input`, {
  fontSize: '1.5em',
  width: '100%'
});

globalStyle(`${inputWrapper} > div`, {
  fontSize: '1.5em',
});

export const closingAction = style({
  borderRadius: '50%',
  background: 'white',
  color: 'black',
  height: '2.5em',
  width: '2.5em',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  right: '2em',
  cursor: 'pointer'
});

globalStyle(`${closingAction}`, {
});