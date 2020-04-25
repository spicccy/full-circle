import puppeteer, { Browser, Page } from 'puppeteer';

export const withPage = async <T>(
  browser: Browser,
  fn: (page: Page) => Promise<T>
): Promise<T> => {
  const page = await browser.newPage();
  const result = await fn(page);
  await page.close();
  return result;
};

export const withBrowser = async <T>(
  fn: (browser: Browser) => Promise<T>
): Promise<T> => {
  const browser = await puppeteer.launch({ headless: false });
  const result = await fn(browser);
  await browser.close();
  return result;
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
