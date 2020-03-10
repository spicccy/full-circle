import React, { FunctionComponent } from 'react';
import { useRoom } from 'src/contexts/RoomContext';

const MainPage: FunctionComponent = () => {
  const { room, createAndJoinRoom } = useRoom();

  return (
    <div>
      {room ? <h1>Room {room.id}</h1> : null}
      <button onClick={createAndJoinRoom}>Join Room</button>
    </div>
  );
};

export { MainPage };
