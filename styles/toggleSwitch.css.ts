import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

export const buttonWrapper = style({
    display: 'flex',
    flexDirection: 'row',
    width: '118.5%',
    marginTop: '-2em',
    marginLeft: '-2em',
    padding: '0',
    background: 'rgba(20, 20, 20, .5)'
})

globalStyle(`${buttonWrapper} button`, {
    color: 'white',
    width: '100%',
    display: 'block',
    background: 'rgb(255, 69, 58)',
    height: '5em',
    borderTopLeftRadius: '10px',
    border: 'none',
    fontSize: '17px',
    fontFamily: 'inherit',
    fontWeight: '500'
})

globalStyle(`${buttonWrapper} button:last-child`, {
    color: 'white',
    width: '100%',
    display: 'block',
    height: '5em',
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '0px',
    borderRight: '1px solid black',
    borderBottom: '2px solid rgb(68, 69, 76)',
    background: 'rgb(38, 39, 47)',
})