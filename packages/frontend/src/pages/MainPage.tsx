import React, { FunctionComponent } from 'react';
import { Button } from 'grommet';
import { useRoom } from 'src/contexts/RoomContext';

const MainPage: FunctionComponent = () => {
  const { room, createAndJoinRoom, leaveRoom } = useRoom();

  return (
    <div>
      {room ? <h1>Room {room.id}</h1> : null}
      <Button onClick={createAndJoinRoom} label="Join Room" />
      <Button onClick={leaveRoom} label="Leave Room" />
    </div>
  );
};

export { MainPage };
