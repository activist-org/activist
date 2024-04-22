import { expect, test } from '../fixtures/page-fixtures';

test.describe('homepage', () => {

  // Initialize page before each test
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto('/en');
    const landingSplash = await landingPage.getLandingSplash();
    await landingSplash.waitFor({ state: 'visible' });
  });

  test('should display the title "activist"', async ({ landingPage }) => {
    const pageTitle = await landingPage.getPage.title();
    console.log('Page Title:', pageTitle);
    expect(pageTitle).toContain('activist');
  });

  test('should contain the request access link', async ({ landingPage }) => {
    const requestAccessLink = await landingPage.getRequestAccessLink();
    await requestAccessLink.waitFor({ state: 'visible' });
    expect(await requestAccessLink.getAttribute('href'))
      .toBe('https://tally.so/r/nprxbq');
  });
});
