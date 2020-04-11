import { Page } from 'puppeteer';

let imgCounter = 0;
let dir = 'create_and_join_game';

export function changeDir(newDir: string) {
  imgCounter = 0;
  dir = newDir;
}

export function screenshotName(name: string) {
  imgCounter += 1;
  return 'screenshots/'
    .concat(dir)
    .concat('/')
    .concat(imgCounter.toString(10))
    .concat('_')
    .concat(name)
    .concat('.png');
}

export const joinGame = async (
  playerName: string,
  roomCode: string,
  newPage: Page,
  isScreenshot: boolean
) => {
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
  if (isScreenshot) {
    await newPage.screenshot({
      path: screenshotName('player_joined_room.png'),
    });
  }
  await expect(newPage).toMatch('Joined room');
};
