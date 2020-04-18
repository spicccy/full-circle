import { Colour } from '@full-circle/shared/lib/canvas';
import { Box } from 'grommet';
import { Clipboard as ClipboardIcon } from 'grommet-icons';
import React, { FunctionComponent } from 'react';
import Clipboard from 'react-clipboard.js';
import styled from 'styled-components';

interface ICopyLink {
  url: string;
}

// semantically not a real link as we don't want to navigate; only copy
const Link = styled.div`
  margin: 4px;
  margin-left: 8px;
  margin-right: 8px;
`;

const ClipboardButton = styled(Clipboard)`
  margin: 0;
  outline: none;
  background-color: #eeeeee;
  border: none;
  padding: 4px;
  cursor: pointer;
  :hover {
    background-color: ${Colour.LIGHT_GRAY};
  }
  :active {
    background-color: ${Colour.YELLOW};
    color: ${Colour.ORANGE};
  }
`;

const CopyLink: FunctionComponent<ICopyLink> = ({ url }) => {
  return (
    <Box
      direction="row"
      align="center"
      border={{
        color: Colour.ORANGE,
        size: 'small',
        style: 'solid',
        side: 'all',
      }}
      round="xsmall"
    >
      <Link data-testHidden="true">{url}</Link>
      <ClipboardButton data-clipboard-text={url}>
        <ClipboardIcon color={Colour.BLACK} />
      </ClipboardButton>
    </Box>
  );
};
export { CopyLink };
