import { ThemeType } from 'grommet';
import { merge } from 'lodash';
import { theme } from './theme';

export const notepadTheme: ThemeType = merge({}, theme, {
  global: {
    font: {
      family: 'PermanentMarker',
      size: '18px',
      height: '20px',
    },
  },
});
