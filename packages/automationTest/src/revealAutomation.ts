import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

export const vote = async (
  playerPage: Page,
  vote: boolean,
  snapshot: string
) => {
  await playerPage.bringToFront();
  setCurrPage(playerPage);
  let selector = "[data-testid='likeButton']";
  if (!vote) selector = "[data-testid='dislikeButton']";
  await playerPage.waitForSelector(selector);
  await playerPage.click(selector);
  await playerPage.waitFor(1000);
  await compareSnapshot(playerPage, snapshot);
};

export const nextChain = async (playerPage: Page) => {
  await playerPage.bringToFront();
  setCurrPage(playerPage);
  await playerPage.waitForSelector("[data-testid='nextChain']");
  await playerPage.click("[data-testid='nextChain");
};
