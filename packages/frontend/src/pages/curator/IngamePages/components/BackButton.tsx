import { ButtonType } from 'grommet';
import React, { FunctionComponent } from 'react';
import { LinkButton } from 'src/components/Link/LinkButton';
import { useRoom } from 'src/contexts/RoomContext';
import styled from 'styled-components';

const StyledBackButton = styled(LinkButton)`
  position: fixed;
  top: 25px;
  left: 35px;
`;

const BackButton: FunctionComponent<ButtonType> = (props) => {
  const { leaveRoom } = useRoom();

  const handleLeaveRoom = () => {
    if (window.confirm('You sure you want to leave?')) {
      leaveRoom();
      return true;
    }

    return false;
  };

  return (
    <StyledBackButton
      label="Back"
      href="/create"
      onClick={handleLeaveRoom}
      {...props}
    />
  );
};

export { BackButton };
