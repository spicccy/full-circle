import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

export const makeGuess = async (
  playerPage: Page,
  snapshot: string,
  guess: string
) => {
  await playerPage.bringToFront();
  await setCurrPage(playerPage);
  await playerPage.waitForSelector("[data-testid='guessBox']");
  await playerPage.click('input[data-testid=guessBox]');
  await playerPage.type('input[data-testid=guessBox]', guess);
  await compareSnapshot(playerPage, snapshot);

  await playerPage.waitForSelector("[data-testid='submitGuess']");
  await playerPage.click("[data-testid='submitGuess']");
};
