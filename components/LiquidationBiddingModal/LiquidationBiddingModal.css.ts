import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const liquidationBiddingModalWrapper = style({
  width: '98%',
  height: '90%',
  background: 'rgb(30, 30, 30)',
  position: 'absolute',
  left: '1%',
  top: '1%',
  marginLeft: '0',
  marginTop: '0',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  padding: '1.5em',
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    'screen and (min-width: 720px)': {
      width: '30em',
      height: '35em',
      left: '50%',
      top: '50%',
      marginLeft: '-15em',
      marginTop: '-20em',
      border: '2px solid black',
    }
  }
});

globalStyle(`${liquidationBiddingModalWrapper} > div`, {
  flex: '1 1px',
  fontSize: '1.2em',
});

globalStyle(`${liquidationBiddingModalWrapper} div button`, {
  width: '100%',
  margin: '.5em 0'
});

export const baseWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end'
});

export const inputWrapper = style({
});

globalStyle(`${inputWrapper} > input`, {
  fontSize: '1.5em',
  width: '100%',
  borderRadius: '8px',
  padding: '.25em',
  border: 'none'
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
  right: '1em',
  cursor: 'pointer'
});