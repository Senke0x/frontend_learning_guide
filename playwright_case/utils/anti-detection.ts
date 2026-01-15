/**
 * Anti-detection utilities for Playwright tests
 *
 * Provides human-like behavior patterns to avoid bot detection:
 * - Random delays between actions
 * - Jittered wait times
 * - Human-like click patterns
 */

import type { Page, Locator } from '@playwright/test';

/**
 * Random delay between min and max milliseconds
 * Default: 500-2000ms for moderate anti-detection
 */
export function randomDelay(min = 500, max = 2000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Wait with random jitter for more human-like behavior
 * Adds 0-50% jitter to the base time
 */
export async function humanWait(page: Page, base = 1000): Promise<void> {
  const jitter = Math.random() * base * 0.5;
  await page.waitForTimeout(Math.floor(base + jitter));
}

/**
 * Click with random pre-delay to simulate human reaction time
 */
export async function humanClick(locator: Locator): Promise<void> {
  await randomDelay(200, 800);
  await locator.click();
}

/**
 * Fill input with random typing delay
 */
export async function humanFill(locator: Locator, text: string): Promise<void> {
  await randomDelay(100, 400);
  await locator.fill(text);
  await randomDelay(200, 500);
}

/**
 * Scroll page with human-like behavior
 */
export async function humanScroll(
  page: Page,
  direction: 'down' | 'up' = 'down',
  distance = 500
): Promise<void> {
  const actualDistance = direction === 'down' ? distance : -distance;
  const jitter = Math.floor(Math.random() * 100) - 50;

  await page.evaluate((d) => {
    window.scrollBy({ top: d, behavior: 'smooth' });
  }, actualDistance + jitter);

  await randomDelay(300, 800);
}
