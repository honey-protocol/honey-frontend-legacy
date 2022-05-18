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
      height: '44em',
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

// globalStyle(`${liquidationBiddingModalWrapper} > div > div`, {
//   margin: '.5em 0',
// });

// globalStyle(`${liquidationBiddingModalWrapper} button`, {
//   width: '100%',
//   margin: '.5em 0',
//   bottom: '-5em',
// });

// globalStyle(`${liquidationBiddingModalWrapper} div:last-child`, {
//   marginBottom: '1em',
//   width: '90%',
//   bottom: '-1em'
// });

// export const bidWrapper = style({
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'space-between'
// });

// export const buttonWrapper = style({
//   width: '100%',
//   position: 'relative',
//   // bottom: '-10em'
// });

// globalStyle(`${buttonWrapper} > button`, {
//   width: '100%',
//   marginTop: '2.5em',
//   '@media': {
//     'screen and (min-width: 720px)': {
//       marginTop: '3.5em'
//     }
//   }
// });

export const inputWrapper = style({
});

globalStyle(`${inputWrapper} > input`, {
  fontSize: '1.5em',
  width: '100%',
  borderRadius: '8px',
  padding: '.25em',
  border: 'none'
});

// globalStyle(`${inputWrapper} > div`, {
//   fontSize: '1.5em',
// });

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

// globalStyle(`${closingAction}`, {
// });