import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.airbnb.com.sg/');
  await page.getByText('Where').click();
  await page.getByTestId('option-3').click();
  await page.getByRole('button', { name: '15, Thursday, January 2026,' }).click();
  await page.getByRole('button', { name: '31, Saturday, January 2026.' }).click();
  await page.getByRole('button', { name: '20, Friday, February 2026.' }).click();
  await page.getByRole('button', { name: '20, Friday, February 2026.' }).click();
  await page.getByRole('button', { name: '24, Tuesday, February 2026.' }).click();
  await page.getByRole('button', { name: 'Who Add guests' }).click();
  await page.getByTestId('stepper-adults-increase-button').dblclick();
  await page.getByTestId('structured-search-input-search-button').click();
  await page.getByRole('button', { name: 'Got it' }).click();
  await page.getByRole('link', { name: 'Serviced apartment in Taitō-ku' }).click();
  await page.getByText('$1,051 SGDShow price breakdown').click();
  await page.getByTestId('modal-container').click();
  await page.getByTestId('modal-container').click();
  const page1Promise = page.waitForEvent('popup');
  await page
    .locator(
      'div:nth-child(2) > .cfutgp0 > div > div > div > .cy5jw6o > .lxq01kf > .mz543g6 > .c14dgvke > .cnjlbcx > .s1yvqyx7 > div > .awuxh4x > .cw9aemg > .c14whb16 > a',
    )
    .first()
    .click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Close' }).click();
  await page1.getByRole('button', { name: 'Show all photos' }).click();
  await page1.goto(
    'https://www.airbnb.com.sg/rooms/1406456139126130924?adults=3&check_in=2026-02-20&check_out=2026-02-24&search_mode=regular_search&source_impression_id=p3_1768488912_P3mNCUtpHV42uVIx&previous_page_section_name=1000&federated_search_id=6890deca-8d5d-4ece-8844-9c76f2d439e7',
  );
});
