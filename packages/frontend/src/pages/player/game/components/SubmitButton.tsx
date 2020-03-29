import { Colour } from '@full-circle/shared/lib/canvas';
import { Button, ButtonType } from 'grommet';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const SubmitButtonStyle = styled(Button)`
  font-size: 20px;
  padding: 12px;
  text-decoration: 2px underline;
  width: min-content;
  margin-left: auto;
  color: ${Colour.PURPLE};
`;

const SubmitButton: FunctionComponent<ButtonType> = (props) => (
  <SubmitButtonStyle plain {...props} />
);

export { SubmitButton };
