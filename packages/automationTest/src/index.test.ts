describe('Full Circle', () => {
  beforeAll(async () => {
    jest.setTimeout(20000);
    page.setDefaultTimeout(5000);
    await page.goto('localhost:3000/');
  });

  const joinGame = async (playerName, roomCode, newPage, path1, path2) => {
    await newPage.goto('localhost:3000/');
    await newPage.waitForSelector('[data-testid=playerNameInput]');
    await newPage.click('input[data-testid=playerNameInput]');
    await newPage.type('input[data-testid=playerNameInput]', playerName);
    await newPage.click('input[data-testid=roomCodeInput]');
    await newPage.type('input[data-testid=roomCodeInput]', roomCode);
    await newPage.screenshot({
      path: 'screenshots/create_and_join_game/'.concat(path1),
    });
    await Promise.all([
      newPage.click('[data-testid=joinRoom]'),
      newPage.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await newPage.screenshot({
      path: 'screenshots/create_and_join_game/'.concat(path2),
    });
    await expect(newPage).toMatch('Joined room');
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
    const playerPage1 = await browser.newPage();
    await joinGame(
      'Player 1',
      roomCode,
      playerPage1,
      '04_player_1_login.png',
      '05_player_1_joined.png'
    );
    const playerPage2 = await browser.newPage();
    await joinGame(
      'Player 2',
      roomCode,
      playerPage2,
      '06_player_2_login.png',
      '07_player_2_joined.png'
    );
    const playerPage3 = await browser.newPage();
    await joinGame(
      'Player 3',
      roomCode,
      playerPage3,
      '08_player_3_login.png',
      '09_player_3_joined.png'
    );
    await page.screenshot({
      path: 'screenshots/create_and_join_game/10_lobby_with_player.png',
    });
    await expect(page).toMatch('Player 1');
    await expect(page).toMatch('Player 2');
    await expect(page).toMatch('Player 3');
  });
});
