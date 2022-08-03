import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';
/**
 * header wrapper for liquidation page
*/
export const liquidationHeaderWrapper = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 720px)': {
      display: 'flex',
      justifyContent: 'space-between',
      color: 'white',
      fontSize: '1.2em',
      margin: '.75em 0',
      padding: '.1em',
    }
  }
});
/**
 * header container for child elems
*/
export const liquidationHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
});
/**
 * align header items according to market and collection data
*/
globalStyle(`${liquidationHeaderContainer} > div`, {
  minWidth: '20%',
  textAlign: 'center'
});