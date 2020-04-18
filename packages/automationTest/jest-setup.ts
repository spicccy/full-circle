import { Page } from 'puppeteer';

import { screenshotName, screenshotDir } from './src/screenshotAutomation';

let currPage = page;

require('expect-puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

declare global {
  namespace NodeJS {
    interface Global {
      it: (name: any, func: any) => Promise<void>;
    }
  }
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R;
    }
  }
}

global.it = async function (name, func) {
  return await test(name, async () => {
    try {
      await func();
    } catch (e) {
      await currPage.screenshot({
        path: screenshotDir().concat(screenshotName('.failure.png')),
      });
      browser.close();
      throw e;
    }
  });
};

export function setCurrPage(newPage: Page) {
  currPage = newPage;
}
