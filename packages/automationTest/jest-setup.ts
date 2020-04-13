import { screenshotName } from './src/screenshotAutomation';
import { Page } from 'puppeteer';

let currPage = page;

require('expect-puppeteer');

declare global {
  namespace NodeJS {
    interface Global {
      it: (name: any, func: any) => Promise<void>;
    }
  }
}

global.it = async function (name, func) {
  return await test(name, async () => {
    try {
      await func();
    } catch (e) {
      await currPage.screenshot({
        path: screenshotName('failure'),
      });
      throw e;
    }
  });
};

export function setCurrPage(newPage: Page) {
  currPage = newPage;
}
