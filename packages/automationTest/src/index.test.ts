import { drawImage } from './drawingAutomation';
import { joinGame, screenshotName, changeDir } from './lobbyAutomation';
import { makeGuess } from './guessingAutomation';

describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);
    await page.goto('localhost:3000/');
  });

  it('should display the login page with links to join/create a room', async () => {
    await page.screenshot({
      path: screenshotName('login_page.png'),
    });
    await expect(page).toMatch('Full Circle');
    await expect(page).toMatch('OR create a new game here');
  });

  it('should successfully navigate to the room creation page', async () => {
    await page.waitForSelector("[data-testid='newGame']");
    await Promise.all([
      page.click("[data-testid='newGame']"),
      page.waitForNavigation(),
    ]);
    await page.screenshot({
      path: screenshotName('home_page.png'),
    });
    await expect(page).toMatch('Create a Room');
  });

  it('should be able to successfully create a room', async () => {
    await page.waitForSelector("[data-testid='createGame']");
    await Promise.all([
      page.click("[data-testid='createGame']"),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.screenshot({
      path: screenshotName('lobby_no_players.png'),
    });
    await expect(page).toMatch('Room ID');
  });

  it('should be able to join the room with another browser instance', async () => {
    await page.waitForXPath("//p[@data-testid='roomID']");
    const [element] = await page.$x("//p[@data-testid='roomID']");
    const codeString = await page.evaluate(
      (element) => element.textContent,
      element
    );
    const roomCode = codeString.replace('Room ID : ', '');
    const context1 = await browser.createIncognitoBrowserContext();
    const playerPage1 = await context1.newPage();
    await joinGame('Player 1', roomCode, playerPage1, true);
    const context2 = await browser.createIncognitoBrowserContext();
    const playerPage2 = await context2.newPage();
    await joinGame('Player 2', roomCode, playerPage2, false);
    const context3 = await browser.createIncognitoBrowserContext();
    const playerPage3 = await context3.newPage();
    await joinGame('Player 3', roomCode, playerPage3, false);
    await page.screenshot({
      path: screenshotName('lobby_with_player.png'),
    });
    await expect(page).toMatch('Player 1');
    await expect(page).toMatch('Player 2');
    await expect(page).toMatch('Player 3');

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
  });
});
