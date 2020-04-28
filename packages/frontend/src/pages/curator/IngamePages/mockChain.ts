import {
  IChain,
  ILink,
  IPlayer,
  LinkType,
  StickyNoteColour,
} from '@full-circle/shared/lib/roomState';

export const mockPlayersMap: Record<string, IPlayer> = {
  player1: {
    id: 'player1',
    username: 'Daniel',
    disconnected: false,
    submitted: false,
    score: 0,
    votes: 0,
    stickyNoteColour: StickyNoteColour.BLUE,
    roundData: null,
  },
  player2: {
    id: 'player2',
    username: 'Alex',
    disconnected: false,
    submitted: false,
    score: 0,
    votes: 0,
    stickyNoteColour: StickyNoteColour.RED,
    roundData: null,
  },
  player3: {
    id: 'player3',
    username: 'Damien',
    disconnected: false,
    submitted: false,
    score: 0,
    votes: 0,
    stickyNoteColour: StickyNoteColour.PURPLE,
    roundData: null,
  },
  player4: {
    id: 'player4',
    username: 'Winson',
    disconnected: false,
    submitted: false,
    score: 0,
    votes: 0,
    stickyNoteColour: StickyNoteColour.CYAN,
    roundData: null,
  },
};

const imageString =
  '[{"type":"@canvas/drawStrokeAction","payload":{"pen":{"type":"solid","penColour":"#000000","penThickness":18},"points":[{"x":231.25,"y":235.78124046325684},{"x":231.25,"y":231.09374046325684},{"x":231.25,"y":229.53124046325684},{"x":318.75,"y":184.21874046325684},{"x":348.4375,"y":188.90624046325684},{"x":371.875,"y":201.40624046325684},{"x":381.25,"y":213.90624046325684},{"x":382.8125,"y":223.28124046325684},{"x":382.8125,"y":232.65624046325684},{"x":375,"y":243.59374046325684},{"x":368.75,"y":248.28124046325684},{"x":364.0625,"y":251.40624046325684},{"x":362.5,"y":251.40624046325684},{"x":357.8125,"y":251.40624046325684},{"x":354.6875,"y":251.40624046325684},{"x":346.875,"y":251.40624046325684},{"x":343.75,"y":251.40624046325684}]}}]';

//TODO: better mock images
const getMockImage = (id: string, playerId: string): ILink => ({
  id,
  type: LinkType.IMAGE,
  data: imageString,
  playerId,
});

const getMockPrompt = (
  id: string,
  playerId: keyof typeof mockPlayersMap,
  prompt: string
): ILink => ({
  id,
  type: LinkType.PROMPT,
  data: prompt,
  playerId,
});

const links: ILink[] = [
  getMockPrompt('1', '', 'cat'),
  getMockImage('2', 'player1'),
  getMockPrompt('3', 'player2', 'mouse?'),
  getMockImage('4', 'player3'),
  getMockPrompt('5', 'player4', 'cat??'),
];

export const mockChain = (nLinks: number): IChain => {
  return {
    owner: 'player1',
    links: links.slice(0, nLinks),
  };
};
