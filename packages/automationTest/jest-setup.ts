import { Page } from 'puppeteer';
import { screenshotName, dir } from './src/screenshotAutomation';
import path from 'path';
import assert from 'assert';

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
        path: path.resolve('screenshots', dir, screenshotName('.failure.png')),
      });
      throw e;
    }
  });
};

export function setCurrPage(newPage: Page) {
  currPage = newPage;
}
