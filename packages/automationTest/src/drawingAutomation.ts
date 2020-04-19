import { BoundingBox, Page } from 'puppeteer';

import { setCurrPage } from '../jest-setup';
import { compareSnapshot } from './screenshotAutomation';

const imageString =
  '[{"type":"@canvas/drawStrokeAction","payload":{"pen":{"type":"solid","penColour":"#000000","penThickness":18},"points":[{"x":231.25,"y":235.78124046325684},{"x":231.25,"y":231.09374046325684},{"x":231.25,"y":229.53124046325684},{"x":318.75,"y":184.21874046325684},{"x":348.4375,"y":188.90624046325684},{"x":371.875,"y":201.40624046325684},{"x":381.25,"y":213.90624046325684},{"x":382.8125,"y":223.28124046325684},{"x":382.8125,"y":232.65624046325684},{"x":375,"y":243.59374046325684},{"x":368.75,"y":248.28124046325684},{"x":364.0625,"y":251.40624046325684},{"x":362.5,"y":251.40624046325684},{"x":357.8125,"y":251.40624046325684},{"x":354.6875,"y":251.40624046325684},{"x":346.875,"y":251.40624046325684},{"x":343.75,"y":251.40624046325684}]}}]';

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
  setCurrPage(playerPage);
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
