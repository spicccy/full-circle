import { IChain, ILink, LinkType } from '@full-circle/shared/lib/roomState';

const imageString =
  '[{"type":"@canvas/drawStrokeAction","payload":{"pen":{"type":"solid","penColour":"#000000","penThickness":18},"points":[{"x":231.25,"y":235.78124046325684},{"x":231.25,"y":231.09374046325684},{"x":231.25,"y":229.53124046325684},{"x":318.75,"y":184.21874046325684},{"x":348.4375,"y":188.90624046325684},{"x":371.875,"y":201.40624046325684},{"x":381.25,"y":213.90624046325684},{"x":382.8125,"y":223.28124046325684},{"x":382.8125,"y":232.65624046325684},{"x":375,"y":243.59374046325684},{"x":368.75,"y":248.28124046325684},{"x":364.0625,"y":251.40624046325684},{"x":362.5,"y":251.40624046325684},{"x":357.8125,"y":251.40624046325684},{"x":354.6875,"y":251.40624046325684},{"x":346.875,"y":251.40624046325684},{"x":343.75,"y":251.40624046325684}]}}]';

const mockImage: ILink = {
  type: LinkType.IMAGE,
  id: '',
  data: imageString,
  playerId: 'ImageDrawerId',
};

const mockPrompt: ILink = {
  type: LinkType.PROMPT,
  id: '',
  data: 'cat',
  playerId: 'PromptGuesserId',
};

export const mockChain: IChain = {
  owner: 'OwnerId',
  links: [
    mockPrompt,
    mockImage,
    mockPrompt,
    mockImage,
    mockPrompt,
    mockImage,
    mockPrompt,
    mockImage,
    mockPrompt,
  ],
};
