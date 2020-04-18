import { Page } from 'puppeteer';

let imgCounter = 0;
let dir = 'create_and_join_game';

export function changeDir(newDir: string) {
  imgCounter = 0;
  dir = newDir;
}

export function screenshotDir() {
  return 'screenshots/'.concat(dir).concat('/');
}

export function screenshotName(name: string) {
  imgCounter += 1;
  return imgCounter.toString(10).concat('_').concat(name);
}

export function diffDir() {
  return screenshotDir().concat('diff/');
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

export const removeElements = async (currPage: Page) => {
  await currPage.evaluate(() => {
    (
      document.querySelectorAll("[data-testHidden='true']") || []
    ).forEach((el) => el.remove());
  });
};
