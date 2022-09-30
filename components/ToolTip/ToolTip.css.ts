import { style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const infoContainer = style({
  marginLeft: vars.space[2],
  transitionDuration: '300',
  position: 'absolute',
  left: '100%',
  top: '50%',
  width: '400px',
  transform: 'translateY(-50%)',
  backgroundColor: 'black',
  padding: '10px',
  fontSize: '14px',
  borderWidth: '2.5px',
  borderRadius: vars.radii.extraLarge
});
