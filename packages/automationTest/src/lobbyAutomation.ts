import { Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

export const joinGame = async (
  playerName: string,
  roomCode: string,
  newPage: Page,
  isScreenshot: boolean
) => {
  await setCurrPage(newPage);
  await newPage.setViewport({
    width: 720,
    height: 1280,
    deviceScaleFactor: 1,
  });
  await newPage.goto('http://localhost:2567');
  await newPage.waitForSelector('[data-testid=roomCodeInput]');
  await newPage.click('input[data-testid=roomCodeInput]');
  await newPage.type('input[data-testid=roomCodeInput]', roomCode);
  await newPage.waitForSelector('[data-testid=joinRoom]');
  if (isScreenshot) {
    await compareSnapshot(newPage, 'join_with_code');
  }
  await Promise.all([
    newPage.click('[data-testid=joinRoom]'),
    newPage.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  await newPage.waitForSelector('[data-testid=playerNameInput]');
  await newPage.click('input[data-testid=playerNameInput]');
  await newPage.type('input[data-testid=playerNameInput]', playerName);
  await newPage.waitForSelector('[data-testid=joinWithName]');
  if (isScreenshot) {
    await compareSnapshot(newPage, 'player_with_name');
  }
  await newPage.click('[data-testid=joinWithName]');
  await expect(newPage).toMatch('Joined room');
  if (isScreenshot) {
    await compareSnapshot(newPage, 'player_login');
  }
};
