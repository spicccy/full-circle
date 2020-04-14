import { drawImage } from './drawingAutomation';
import { makeGuess } from './guessingAutomation';
import { joinGame } from './lobbyAutomation';
import { revealChain } from './revealAutomation';
import { changeDir, screenshotName } from './screenshotAutomation';

const pageList = [page];

describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);
    await page.goto('localhost:3000/');
  });

  it('should display the login page with links to join/create a room', async () => {
    await expect(page).toMatch('Full Circle');
    await expect(page).toMatch('OR create a new game here');
    await page.screenshot({
      path: screenshotName('login_page.png'),
    });
  });

  it('should successfully navigate to the room creation page', async () => {
    await page.waitForSelector("[data-testid='newGame']");
    await Promise.all([
      page.click("[data-testid='newGame']"),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatch('Create a Room');
    await page.screenshot({
      path: screenshotName('home_page.png'),
    });
  });

  it('should be able to successfully create a room', async () => {
    await page.waitForSelector("[data-testid='createGame']");
    await Promise.all([
      page.click("[data-testid='createGame']"),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await expect(page).toMatch('Room');
    await page.screenshot({
      path: screenshotName('lobby_no_players.png'),
    });
  });

  it('should be able to join the room with 3 other browser instances', async () => {
    await page.waitForXPath("//h3[@data-testid='roomID']");
    const [element] = await page.$x("//h3[@data-testid='roomID']");
    const codeString = await page.evaluate(
      (element) => element.textContent,
      element
    );
    const roomCode = codeString.replace('Room: ', '');
    const context1 = await browser.createIncognitoBrowserContext();
    const playerPage1 = await context1.newPage();
    pageList.push(playerPage1);
    await joinGame('Player 1', roomCode, playerPage1, true);
    const context2 = await browser.createIncognitoBrowserContext();
    const playerPage2 = await context2.newPage();
    pageList.push(playerPage2);
    await joinGame('Player 2', roomCode, playerPage2, false);
    const context3 = await browser.createIncognitoBrowserContext();
    const playerPage3 = await context3.newPage();
    pageList.push(playerPage3);
    await joinGame('Player 3', roomCode, playerPage3, false);
    await expect(page).toMatch('Player 1');
    await expect(page).toMatch('Player 2');
    await expect(page).toMatch('Player 3');
    await page.screenshot({
      path: screenshotName('lobby_with_player.png'),
    });
  });
  it('should be able to play the first draw/guess rounds successfully', async () => {
    changeDir('draw_guess_round_1');
    await page.waitForSelector("[data-testid='startGame']");
    await page.click("[data-testid='startGame']");
    await page.waitForSelector("[data-testid='curatorTimer']");
    await drawImage(pageList[1], 'drawing_player_1', 'red (e)');
    await drawImage(pageList[2], 'drawing_player_2', 'yellow (r)');
    await drawImage(pageList[3], 'drawing_player_3', 'blue (g)');
    await makeGuess(pageList[1], 'guess_player_1.', 'Guess 1_1');
    await makeGuess(pageList[2], 'guess_player_2.', 'Guess 2_1');
    await makeGuess(pageList[3], 'guess_player_3.', 'Guess 3_1');
  });

  it('should be able to play the second draw round successfully', async () => {
    changeDir('draw_guess_round_2');
    await drawImage(pageList[1], 'drawing_player_1', 'green (t)');
    await drawImage(pageList[2], 'drawing_player_2', 'purple (y)');
    await drawImage(pageList[3], 'drawing_player_3', 'orange (d)');
  });

  it('should be able to transition to the reveal phase where players reveal their chains', async () => {
    changeDir('reveal_screen');
    await revealChain(pageList[1], 'reveal_screen_player_1');
    await revealChain(pageList[2], 'reveal_screen_player_2');
    await revealChain(pageList[3], 'reveal_screen_player_3');
  });
});
