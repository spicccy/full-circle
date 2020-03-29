import { Box, defaultProps } from 'grommet';
import styled from 'styled-components';

const BorderBottom = styled(Box)({
  borderBottom: `4px dashed ${defaultProps.theme.global?.colors?.['dark-1']}`,
});

export { BorderBottom };
