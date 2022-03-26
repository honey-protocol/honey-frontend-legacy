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
// style based off of pseudo - also for the input; should define this for moz and other browsers
globalStyle(`${rangeSlider} > input::-webkit-slider-thumb`, {
    appearance: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #DA630D 0%, #F5A94E 51.04%, #D27910 100%)',
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
    marginBottom: '2em'
})


