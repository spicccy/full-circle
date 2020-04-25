export enum PhaseType {
  LOBBY = 'LOBBY',
  DRAW = 'DRAW',
  GUESS = 'GUESS',
  REVEAL = 'REVEAL',
  END = 'END',
}

export enum LinkType {
  IMAGE = 'image',
  PROMPT = 'prompt',
}

export enum RoomError {
  ROOM_NOT_FOUND = 'No room with a matching code was found',
  ROOM_INITIALISATION_ERROR = 'Unable to initialise the room',
  NETWORK_ERROR = 'Network error. Please check your connection and try again',
  RECONNECT_ERROR = 'Failed to reconnect',
  UNKNOWN_ERROR = 'An unknown error occured',
}

export enum ServerError {
  TOO_MANY_PLAYERS = 'The room is already full',
  CONFLICTING_USERNAMES = 'That username has already been taken for this room',
  NOT_ENOUGH_PLAYERS = 'You need at least three players to join this room',
  CURATOR_DISCONNECTED = 'The curator has disconnected. To rejoin as curator, please join the room on curator device, then click "Reconnect as curator"',
}

export enum StickyNoteColour {
  // disconnected
  GRAY = '#bcbcbc',

  RED = '#ffb1b1',
  ORANGE = '#ffc693',
  YELLOW = '#ffeb61',
  GREEN = '#adff91',
  CYAN = '#9affec',
  BLUE = '#9ab5ff',
  PURPLE = '#b79aff',
  PINK = '#ffc8fb',
}
