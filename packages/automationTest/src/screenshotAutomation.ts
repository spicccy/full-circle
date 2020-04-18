import { Page } from 'puppeteer';
import path from 'path';

let imgCounter = 0;
let dir = 'create_and_join_game';

export function changeDir(newDir: string) {
  imgCounter = 0;
  dir = newDir;
}

export function screenshotDir() {
  return path.resolve('screenshots', dir);
}

export function screenshotName(name: string) {
  imgCounter += 1;
  return imgCounter.toString(10).concat('_').concat(name);
}

export function diffDir() {
  return path.resolve('screenshots', dir, 'diff');
}

export const compareSnapshot = async (currPage: Page, imageName: string) => {
  const image = await currPage.screenshot();
  expect(image).toMatchImageSnapshot({
    customSnapshotsDir: screenshotDir(),
    customDiffDir: diffDir(),
    customSnapshotIdentifier: screenshotName(imageName),
    noColors: true,
    failureThreshold: 0.0025,
    failureThresholdType: 'percent',
  });
};
