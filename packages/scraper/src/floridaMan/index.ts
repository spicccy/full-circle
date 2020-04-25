import { Browser } from 'puppeteer';

import { sleep, withBrowser, withPage } from '../utils/utils';

const scrapePage = async (
  browser: Browser,
  pageNumber: number
): Promise<string[]> =>
  withPage(browser, async (page) => {
    await page.goto(`https://floridaman.com/page/${pageNumber}/`, {
      waitUntil: 'domcontentloaded',
    });

    const titles = await page.$$eval('[rel="bookmark"]', (eles) => {
      return eles.map((e) => e.textContent);
    });

    return titles.filter(Boolean) as string[];
  });

export const scrapeFloridaMan = async (): Promise<string[]> =>
  withBrowser(async (browser) => {
    const allTitles = new Set<string>();
    for (let i = 1; i < 18; i++) {
      console.log(`fetching page ${i}`);
      const titles = await scrapePage(browser, i);
      console.log(titles);
      titles.forEach((title) => allTitles.add(title));
      await sleep(1000);
    }

    return [...allTitles];
  });
