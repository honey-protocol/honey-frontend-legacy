import { style } from '@vanilla-extract/css';

export const mobileBgBlur = style({
  '@media': {
    'screen and (max-width: 1020px)': {
      filter: 'blur(3px)'
    }
  }
});

export const pageContainer = style({
  minHeight: '100vh'
});
