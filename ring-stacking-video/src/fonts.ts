import {loadFont} from '@remotion/google-fonts/Kanit';

export const {waitUntilDone, fontFamily} = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin', 'thai'],
});
