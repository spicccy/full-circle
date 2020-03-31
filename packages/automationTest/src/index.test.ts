describe('Full Circle', () => {
  beforeAll(async () => {
    await page.goto('localhost:3000/');
  });

  it('should display "Full Circle" text on page', async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Full Circle');
  });
});
