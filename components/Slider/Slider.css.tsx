import { globalStyle, style } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';
// sets the default wrapper
export const rangeSlider = style({
    margin: '30px 0 0 0%',
    width: '100%',
});
// styles the actual input type is range
export const rangeSliderRange = style({
  appearance: 'none',
  width: '100%',
  height: '15px',
  borderRadius: '15px',
  background: 'black',
  outline: 'none',
  padding: '0',
  margin: '0 0 2em 0',
});

globalStyle(`${rangeSlider} > input`, {
    WebkitAppearance: 'none',
    width: '100%',
    outline: 'none'
})
// style based off of pseudo - also for the input; should define this for moz and other browsers
globalStyle(`${rangeSlider} > input::-webkit-slider-thumb`, {
    WebkitAppearance: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgb(255,69, 58)',
    cursor: 'pointer',
    transition: 'background 0.15s ease-in-out',
})
// styles the percentage calculator
export const percentageWrapper = style({
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    justifyContent: 'space-between',
    width: '95%',
    margin: '0 auto',
    marginBottom: '1em'
})
// styles for the selection overview box; currency / amount and max btn
export const selectionWrapper = style({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '5em',
    width: '100%',
    borderRadius: '15px',
    background: 'black',
    alignItems: 'center',
    marginTop: '0.2em',
})

globalStyle(`${selectionWrapper} > div`, {
    marginLeft: '1em'
})

export const selectionDetails = style({
    display: 'flex',
    alignItems: 'center'
})

globalStyle(`${selectionDetails} > *`, {
    margin: '.75em',
    color: 'gray',
    fontSize: '1em'
})

export const currencyStyles = style({
    fontSize: '2em'
})

export const currencySelector = style({
    background: 'none',
    border: 'none',
    marginLeft: '.1em'
})
