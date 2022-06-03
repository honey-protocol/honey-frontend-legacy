import { Accent, Mode } from 'degen/dist/types/tokens';

export type ThemeAccent = Accent | 'foreground';

export const accents: Accent[] = [
  'orange',
  'yellow',
  'blue',
  'green',
  'indigo',
  'pink',
  'purple',
  'red',
  'teal',
];

export const accentSequence: ThemeAccent[] = [
  ...accents,
  'foreground'
];

export const modes: Mode[] = ['dark', 'light'];

//returns sequence in form of map {'orange': 'yellow', 'yellow': 'blue', ...}
export const nextAccentMap = accentSequence.reduce((acc, color, index) => {
  const isLastColor = index + 1 === accentSequence.length;
  acc[color] = isLastColor ? accentSequence[0] : accentSequence[index + 1];
  return acc;
}, {} as Record<ThemeAccent, ThemeAccent>);
