import { style, globalStyle } from '@vanilla-extract/css';

export const messageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  width: '55vw',
  height: '50vh',
  color: 'white',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  paddingTop: '8em',
  zIndex: '10',
  background: 'rgb(20, 20, 20)',
  border: '2px solid gray',
  borderRadius: '18px',
});

export const blockOne = style({
  width: '80%',
  textAlign: 'center',
  fontSize: '1.2em',
  margin: '0 auto',
  lineHeight: '1.5em',
  color: 'rgb(185, 185, 185)'
});

export const heading = style({
  fontWeight: 'bold',
  color: 'white'
});

export const blockTwo = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '4em',
  paddingRight: '2em'
});
