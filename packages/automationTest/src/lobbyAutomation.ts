import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

export const joinGame = async (
  playerName: string,
  roomCode: string,
  newPage: Page,
  isScreenshot: boolean
) => {
  setCurrPage(newPage);
  await newPage.setViewport({
    width: 720,
    height: 1280,
    deviceScaleFactor: 1,
  });
  await newPage.goto('http://localhost:3000');
  await newPage.waitForSelector('[data-testid=playerNameInput]');
  await newPage.click('input[data-testid=playerNameInput]');
  await newPage.type('input[data-testid=playerNameInput]', playerName);
  await newPage.click('input[data-testid=roomCodeInput]');
  await newPage.type('input[data-testid=roomCodeInput]', roomCode);
  if (isScreenshot) {
    await compareSnapshot(newPage, 'player_login');
  }
  await Promise.all([
    newPage.click('[data-testid=joinRoom]'),
    newPage.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  await expect(newPage).toMatch('Joined room');
  if (isScreenshot) {
    await compareSnapshot(newPage, 'player_joined_room');
  }
};
