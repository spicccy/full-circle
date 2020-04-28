import fetch from 'node-fetch';

import { setCurrPage } from '../jest-setup';
import { drawImage } from './drawingAutomation';
import { makeGuess } from './guessingAutomation';
import { joinGame } from './lobbyAutomation';
import { vote, nextChain } from './revealAutomation';
import { changeDir, compareSnapshot } from './screenshotAutomation';

const pageList = [page];
const roomCode = '8722';

describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);
    await fetch('http://localhost:2567/test-reset');
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    await page.goto('http://localhost:2567');
  });

  it('should display the login page with links to join/create a room', async () => {
    await expect(page).toMatch('Full Circle');
    await expect(page).toMatch('OR create a new game here');
    await compareSnapshot(page, 'login_page');
  });

  it('should successfully navigate to the room creation page', async () => {
    await page.waitForSelector("[data-testid='newGame']");
    await Promise.all([
      page.click("[data-testid='newGame']"),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatch('Choose Room Settings');
    await page.waitFor(1500);
    await compareSnapshot(page, 'home_page');
  });

  it('should be able to successfully create a room', async () => {
    await page.waitForSelector("[data-testid='createGame']");
    await Promise.all([
      page.click("[data-testid='createGame']"),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await expect(page).toMatch('Room');
    await compareSnapshot(page, 'lobby_no_players');
  });

  it('should be able to join the room with 3 other browser instances', async () => {
    const context1 = await browser.createIncognitoBrowserContext();
    const playerPage1 = await context1.newPage();
    pageList.push(playerPage1);
    await joinGame('Player1', roomCode, playerPage1, true);
    const context2 = await browser.createIncognitoBrowserContext();
    const playerPage2 = await context2.newPage();
    pageList.push(playerPage2);
    await joinGame('Player2', roomCode, playerPage2, false);
    const context3 = await browser.createIncognitoBrowserContext();
    const playerPage3 = await context3.newPage();
    pageList.push(playerPage3);
    await joinGame('Player3', roomCode, playerPage3, false);
    await setCurrPage(page);
    await expect(page).toMatch('player1');
    await expect(page).toMatch('player2');
    await expect(page).toMatch('player3');
    await compareSnapshot(page, 'lobby_with_player');
  });

  it('should be able to play the first draw/guess rounds successfully', async () => {
    changeDir('draw_guess_round_1');
    await page.waitForSelector("[data-testid='startGame']");
    await page.click("[data-testid='startGame']");
    await page.waitForSelector("[data-testid='curatorTimer']");
    await drawImage(pageList[1], 'drawing_player_1', 'red (e)');
    await drawImage(pageList[2], 'drawing_player_2', 'yellow (r)');
    await drawImage(pageList[3], 'drawing_player_3', 'blue (g)');
    await makeGuess(pageList[1], 'guess_player_1.', 'Account');
    await makeGuess(pageList[2], 'guess_player_2.', 'Guess 2_1');
    await makeGuess(pageList[3], 'guess_player_3.', 'Guess 3_1');
  });

  it('should be able to play the second draw round successfully', async () => {
    changeDir('draw_guess_round_2');
    await drawImage(pageList[1], 'drawing_player_1', 'green (t)');
    await drawImage(pageList[2], 'drawing_player_2', 'purple (y)');
    await drawImage(pageList[3], 'drawing_player_3', 'orange (d)');
  });

  it('should be able to successfully show all chains to players, then show scores', async () => {
    changeDir('reveal_round');
    await vote(pageList[1], true, 'player_1_reveal');
    await vote(pageList[2], false, 'player_2_reveal');
    await vote(pageList[3], true, 'player_3_reveal');
    await nextChain(pageList[1]);
    await nextChain(pageList[2]);
    await nextChain(pageList[3]);
    await page.bringToFront();
    await setCurrPage(page);
    await page.waitForSelector("[data-testid='scoreBoard']");
    await compareSnapshot(page, 'score_board');
  });
});
