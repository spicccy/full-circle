describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(20000);
    page.setDefaultTimeout(5000);
    await page.goto('localhost:3000/');
  });

  const joinGame = async (playerName, roomCode) => {
    const playerPage = await browser.newPage();
    await playerPage.goto('localhost:3000/');
    await playerPage.waitForSelector('[data-testid=playerNameInput]');
    await playerPage.click('input[data-testid=playerNameInput]');
    await playerPage.type('input[data-testid=playerNameInput]', playerName);
    await playerPage.click('input[data-testid=roomCodeInput]');
    await playerPage.type('input[data-testid=roomCodeInput]', roomCode);
    await playerPage.screenshot({
      path: 'screenshots/create_and_join_game/04_login_page_with_details.png',
    });
    await Promise.all([
      playerPage.click('[data-testid=joinRoom]'),
      playerPage.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await playerPage.screenshot({
      path: 'screenshots/create_and_join_game/05_player_joined.png',
    });
    await expect(playerPage).toMatch('Joined room');
    await page.screenshot({
      path: 'screenshots/create_and_join_game/06_lobby_with_player.png',
    });
    await expect(page).toMatch(playerName);
  };

  it('should display the login page with links to join/create a room', async () => {
    await page.screenshot({
      path: 'screenshots/create_and_join_game/01_login_page.png',
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
      path: 'screenshots/create_and_join_game/02_home_page.png',
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
      path: 'screenshots/create_and_join_game/03_lobby_no_players.png',
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
    await joinGame('Player 1', roomCode);
    await joinGame('Player 2', roomCode);
    await joinGame('Player 3', roomCode);
  });
});
