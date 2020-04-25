import { Colour } from '@full-circle/shared/lib/canvas';
import React, { FunctionComponent } from 'react';
import { LinkAnchor } from 'src/components/Link/LinkAnchor';
import { useRoom } from 'src/contexts/RoomContext';
import { Close } from 'src/icons';
import styled from 'styled-components';

const StyledCloseButton = styled(LinkAnchor)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;

  :hover,
  :focus {
    fill: ${Colour.RED};
  }
`;

const CloseButton: FunctionComponent = () => {
  const { leaveRoom } = useRoom();

  return (
    <StyledCloseButton href="/" onClick={leaveRoom}>
      <Close />
    </StyledCloseButton>
  );
};

export { CloseButton };
