import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { screenshotName } from './screenshotAutomation';

export const revealChain = async (playerPage: Page, snapshot: string) => {
  await playerPage.bringToFront();
  setCurrPage(playerPage);
  await playerPage.waitForSelector("[data-testid='nextChain']");
  await playerPage.click("[data-testid='nextChain']");
  setCurrPage(page);
  await page.waitForSelector("[data-testid='revealChain']");
  await page.screenshot({
    path: screenshotName(snapshot),
  });
};
