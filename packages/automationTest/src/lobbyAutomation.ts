import { Page } from 'puppeteer';

import { screenshotName } from './screenshotAutomation';
import { setCurrPage } from '../jest-setup';

export const joinGame = async (
  playerName: string,
  roomCode: string,
  newPage: Page,
  isScreenshot: boolean
) => {
  setCurrPage(newPage);
  await newPage.goto('localhost:3000/');
  await newPage.waitForSelector('[data-testid=playerNameInput]');
  await newPage.click('input[data-testid=playerNameInput]');
  await newPage.type('input[data-testid=playerNameInput]', playerName);
  await newPage.click('input[data-testid=roomCodeInput]');
  await newPage.type('input[data-testid=roomCodeInput]', roomCode);
  if (isScreenshot) {
    await newPage.screenshot({
      path: screenshotName('player_login'),
    });
  }
  await Promise.all([
    newPage.click('[data-testid=joinRoom]'),
    newPage.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  await expect(newPage).toMatch('Joined room');
  if (isScreenshot) {
    await newPage.screenshot({
      path: screenshotName('player_joined_room.png'),
    });
  }
};
