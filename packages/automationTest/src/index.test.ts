import { Page } from 'puppeteer';
var imgCounter = 0;

function screenshotName(name: string) {
  imgCounter += 1;
  return 'screenshots/create_and_join_game/'
    .concat(imgCounter.toString(10))
    .concat('_')
    .concat(name)
    .concat('.png');
}

const joinGame = async (
  playerName: string,
  roomCode: string,
  newPage: Page,
  isScreenshot: Boolean
) => {
  await newPage.goto('localhost:3000/');
  await newPage.waitForSelector('[data-testid=playerNameInput]');
  await newPage.click('input[data-testid=playerNameInput]');
  await newPage.type('input[data-testid=playerNameInput]', playerName);
  await newPage.click('input[data-testid=roomCodeInput]');
  await newPage.type('input[data-testid=roomCodeInput]', roomCode);
  if (isScreenshot) {
    await newPage.screenshot({
      path: screenshotName('player_login'),
    });
  }
  await Promise.all([
    newPage.click('[data-testid=joinRoom]'),
    newPage.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  if (isScreenshot) {
    await newPage.screenshot({
      path: screenshotName('player_joined_room.png'),
    });
  }
  await expect(newPage).toMatch('Joined room');
};

describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(20000);
    page.setDefaultTimeout(5000);
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
    const playerPage1 = await browser.newPage();
    await joinGame('Player 1', roomCode, playerPage1, true);
    const playerPage2 = await browser.newPage();
    await joinGame('Player 2', roomCode, playerPage2, false);
    const playerPage3 = await browser.newPage();
    await joinGame('Player 3', roomCode, playerPage3, false);
    await page.screenshot({
      path: screenshotName('lobby_with_player.png'),
    });
    Promise.all([
      expect(page).toMatch('Player 1'),
      expect(page).toMatch('Player 2'),
      expect(page).toMatch('Player 3'),
    ]);
  });
});
