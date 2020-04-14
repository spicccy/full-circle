import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { screenshotName } from './screenshotAutomation';

export const makeGuess = async (
  playerPage: Page,
  snapshot: string,
  guess: string
) => {
  await playerPage.bringToFront();
  setCurrPage(playerPage);
  await playerPage.waitForSelector("[data-testid='guessBox']");
  await playerPage.click('input[data-testid=guessBox]');
  await playerPage.type('input[data-testid=guessBox]', guess);
  await playerPage.screenshot({
    path: screenshotName(snapshot),
  });
  await playerPage.waitForSelector("[data-testid='submitGuess']");
  await playerPage.click("[data-testid='submitGuess']");
};
