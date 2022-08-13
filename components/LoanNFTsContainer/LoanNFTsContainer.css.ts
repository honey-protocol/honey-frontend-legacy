import { style, globalStyle } from '@vanilla-extract/css';

export const cardContainer = style({
  width: '100%',
  display: 'flex',
  alignItems: 'stretch'
});

export const nftContainer = style({
  overflow: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gridGap: 13,
  '@media': {
    'screen and (max-width: 768px)': {}
  }
});

globalStyle(`${nftContainer} > *`, {
  cursor: 'pointer'
});

export const centerItemContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
});

export const buttonSelectionWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%'
});

globalStyle(`${buttonSelectionWrapper} > button`, {
  cursor: 'pointer'
});

globalStyle(`${buttonSelectionWrapper} > button:first-of-type`, {
  marginLeft: '-.5em'
});

export const buttonActive = style({
  color: 'rgb(255, 159, 10)',
  background: '#ff9f0a33',
  padding: '0 20px',
  borderRadius: '.5rem'
});

export const active = style({
  border: '2px solid orange',
});

export const notActive = style({
  border: 'none',
});

export const errorMessage = style({
  color: 'white',
  fontWeight: '600',
  paddingLeft: '1em',
  paddingTop: '.5m',
  fontSize: '1.2em'
})