import { ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

import { theme } from './theme';

export const notepadTheme: ThemeType = deepMerge(theme, {
  global: {
    font: {
      family: 'PermanentMarker',
      size: '18px',
      height: '20px',
    },
  },
});
