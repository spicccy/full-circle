import { createAction } from 'typesafe-actions';

import { CanvasAction } from '../canvas';
import { VoteType } from '../roomState';

export const submitDrawing = createAction('@client/submitDrawing')<
  CanvasAction[]
>();

export const submitGuess = createAction('@client/submitGuess')<string>();

export const notifyPlayerReady = createAction('@client/notifyPlayerReady')();

export const revealChain = createAction('@client/revealChain')();

export const startGame = createAction('@client/startGame')();

export const joinGame = createAction('@client/joinGame')<{
  username: string;
}>();

export interface IVoteData {
  linkId: string;
  voteType: VoteType;
}

export const vote = createAction('@client/vote')<IVoteData>();
