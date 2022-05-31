import { style, globalStyle } from '@vanilla-extract/css';

export const messageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: '55vw',
  height: '50vh',
  color: 'white',
  top: '20%',
  left: '30%',
  paddingTop: '8em',
  zIndex: '10',
  background: 'black',
  border: '2px solid gray',
  borderRadius: '18px',
});

export const blockOne = style({
  width: '80%',
  textAlign: 'center',
  fontSize: '1.2em',
  margin: '0 auto',
  lineHeight: '1.5em'
});

export const heading = style({
  fontWeight: 'bold'
});

export const blockTwo = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '4em',
  paddingRight: '2em'
});

