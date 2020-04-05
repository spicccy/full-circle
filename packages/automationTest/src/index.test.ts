describe('Full Circle', () => {
  beforeAll(async () => {
    await page.goto('localhost:3000/');
  });

  it('should display the login page with links to join/create a room', async () => {
    await page.screenshot({
      path: 'screenshots/create_and_join_game/01_login_page.png',
    });
    await expect(page).toMatch('Full Circle');
    await expect(page).toMatch('OR create a new game here');
  });

  it('should successfully navigate to the room creation page', async () => {
    const button = await page.$x("//a[@data-testid='newGame']");
    await button[0].click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({
      path: 'screenshots/create_and_join_game/02_home_page.png',
    });
    await expect(page).toMatch('Create a Room');
  });

  it('should be able to successfully create a room', async () => {
    const button = await page.waitForSelector("[data-testid='createGame']");
    await button.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({
      path: 'screenshots/create_and_join_game/03_lobby_no_players.png',
    });
    await expect(page).toMatch('Room ID');
  });

  it('should be able to join the room with another browser instance', async () => {
    await page.waitForXPath("//p[@data-testid='roomID']");
    const [element] = await page.$x("//p[@data-testid='roomID']");
    var codeString = await page.evaluate(
      (element) => element.textContent,
      element
    );
    var roomCode = codeString.replace('Room ID : ', '');
    const playerPage = await browser.newPage();
    await playerPage.goto('localhost:3000/');
    await playerPage.waitForSelector('[data-testid=playerNameInput]');
    await playerPage.click('input[data-testid=playerNameInput]');
    await playerPage.type('input[data-testid=playerNameInput]', 'Test Player');
    await playerPage.click('input[data-testid=roomCodeInput]');
    await playerPage.type('input[data-testid=roomCodeInput]', roomCode);
    await playerPage.screenshot({
      path: 'screenshots/create_and_join_game/04_login_page_with_details.png',
    });
    await playerPage.click('[data-testid=joinRoom]');
    await playerPage.waitForNavigation({ waitUntil: 'networkidle0' });
    await playerPage.screenshot({
      path: 'screenshots/create_and_join_game/05_player_joined.png',
    });
    await expect(playerPage).toMatch('Joined room');
    await page.screenshot({
      path: 'screenshots/create_and_join_game/06_lobby_with_player.png',
    });
    await expect(page).toMatch('Test Player has joined');
  });
});
