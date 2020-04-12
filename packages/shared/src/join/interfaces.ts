export interface IJoinOptions {
  username: string;
}

// how the backend communicates with frontend without a client being in a room
export enum PRE_ROOM_MESSAGE {
  RECONNECT_COMMAND = 'RECONNECT',
}

export type Command = {
  commandType: PRE_ROOM_MESSAGE;
  commandPayload: string;
};

export type NotCommand = {
  commandType: null;
  commandPayload: undefined;
};

export type MaybeCommand = Command | NotCommand;

export const createPreRoomMessage = (
  type: PRE_ROOM_MESSAGE,
  payload: string
): string => {
  return ':' + type + ':' + payload;
};

export const parsePreRoomMessage = (message: string): MaybeCommand => {
  const notCommand = {
    commandType: null,
    commandPayload: undefined,
  };
  if (message.startsWith(':')) {
    const parts = message.split(':');
    console.log(parts);
    switch (parts[1]) {
      case PRE_ROOM_MESSAGE.RECONNECT_COMMAND:
        return {
          commandType: parts[1],
          commandPayload: parts[2],
        };
    }

    return notCommand;
  } else {
    return notCommand;
  }
};
