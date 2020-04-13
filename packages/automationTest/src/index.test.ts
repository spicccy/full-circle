import { drawImage } from './drawingAutomation';
import { makeGuess } from './guessingAutomation';
import { joinGame } from './lobbyAutomation';
import { changeDir, screenshotName } from './screenshotAutomation';

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

  it('should be able to join the room with another browser instance', async () => {
    await page.waitForXPath("//h3[@data-testid='roomID']");
    const [element] = await page.$x("//h3[@data-testid='roomID']");
    const codeString = await page.evaluate(
      (element) => element.textContent,
      element
    );
    const roomCode = codeString.replace('Room: ', '');
    const context1 = await browser.createIncognitoBrowserContext();
    const playerPage1 = await context1.newPage();
    await joinGame('Player 1', roomCode, playerPage1, true);
    const context2 = await browser.createIncognitoBrowserContext();
    const playerPage2 = await context2.newPage();
    await joinGame('Player 2', roomCode, playerPage2, false);
    const context3 = await browser.createIncognitoBrowserContext();
    const playerPage3 = await context3.newPage();
    await joinGame('Player 3', roomCode, playerPage3, false);
    await expect(page).toMatch('Player 1');
    await expect(page).toMatch('Player 2');
    await expect(page).toMatch('Player 3');
    await page.screenshot({
      path: screenshotName('lobby_with_player.png'),
    });

    changeDir('draw_guess_round_1');
    await page.waitForSelector("[data-testid='startGame']");
    await page.click("[data-testid='startGame']");
    await page.waitForSelector("[data-testid='curatorTimer']");
    await drawImage(playerPage1, 'drawing_player_1', 'red (e)');
    await drawImage(playerPage2, 'drawing_player_2', 'yellow (r)');
    await drawImage(playerPage3, 'drawing_player_3', 'blue (g)');
    await makeGuess(playerPage1, 'guess_player_1.', 'Guess 1_1');
    await makeGuess(playerPage2, 'guess_player_2.', 'Guess 2_1');
    await makeGuess(playerPage3, 'guess_player_3.', 'Guess 3_1');

    changeDir('draw_guess_round_2');
    await drawImage(playerPage1, 'drawing_player_1', 'green (t)');
    await drawImage(playerPage2, 'drawing_player_2', 'purple (y)');
    await drawImage(playerPage3, 'drawing_player_3', 'orange (d)');

    changeDir('end_game');
    //await page.waitForSelector("[data-testid='endMessage']");
    await page.screenshot({
      path: screenshotName('game_over'),
    });
  });
});
