import { BoundingBox, Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

const drawLine = async (
  playerPage: Page,
  bBox: BoundingBox,
  coords: number[]
) => {
  await playerPage.mouse.move(
    bBox.x + bBox.width / coords[0],
    bBox.y + bBox.height / coords[1]
  );
  await playerPage.mouse.down();
  await playerPage.mouse.move(
    bBox.x + bBox.width / coords[2],
    bBox.y + bBox.height / coords[3]
  );
  await playerPage.mouse.up();
};

export const drawImage = async (
  playerPage: Page,
  snapshot: string,
  colour: string
) => {
  await playerPage.bringToFront();
  await setCurrPage(playerPage);
  const canvas = await playerPage.waitForSelector("[data-testid='drawCanvas']");
  const colourSelector = "[data-testid='".concat(colour).concat("']");
  await playerPage.waitForSelector(colourSelector);
  await playerPage.click(colourSelector);
  const bBox = await canvas.boundingBox();
  if (bBox != null) {
    await playerPage.waitFor(1000);
    await drawLine(playerPage, bBox, [1.5, 2, 1.5, 3]);
    await playerPage.waitFor(1000);
  }
  await compareSnapshot(playerPage, snapshot);

  await playerPage.waitForSelector("[data-testid='submitDrawing']");
  await playerPage.click("[data-testid='submitDrawing']");
};
