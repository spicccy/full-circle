import path from 'path';
import { Page } from 'puppeteer';

let imgCounter = 0;
export let dir = 'create_and_join_game';
const threshold = 0.99;

export function changeDir(newDir: string) {
  imgCounter = 0;
  dir = newDir;
}

export function screenshotDir() {
  return path.resolve('screenshots', dir);
}

export function screenshotName(name: string) {
  imgCounter += 1;
  return `${imgCounter.toString(10)}_${name}`;
}

export function diffDir() {
  return path.resolve('screenshots', dir, 'diff');
}

export const removeElements = async (currPage: Page) => {
  await currPage.evaluate(() => {
    (
      document.querySelectorAll("[data-testHidden='true']") || []
    ).forEach((el) => el.remove());
  });
};

export const compareSnapshot = async (currPage: Page, imageName: string) => {
  await removeElements(currPage);
  const image = await currPage.screenshot();
  expect(image).toMatchImageSnapshot({
    customSnapshotsDir: screenshotDir(),
    customDiffDir: diffDir(),
    customSnapshotIdentifier: screenshotName(imageName),
    failureThreshold: threshold,
    failureThresholdType: 'percent',
    noColors: true,
  });
};
