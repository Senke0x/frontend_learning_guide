/**
 * Centralized Airbnb selectors with fallback chains
 *
 * Strategy: Use prioritized selector arrays that try multiple selectors
 * in order of stability (data-testid > role > attribute > class)
 *
 * When Airbnb updates their UI, only this file needs to be updated.
 */

import type { Page, Locator } from '@playwright/test';

/**
 * Selector configuration with fallback chain
 */
export interface SelectorConfig {
  /** Most stable selector (usually data-testid) */
  primary: string;
  /** Fallback selectors in order of preference */
  fallbacks: string[];
  /** Human-readable description for logging */
  description: string;
}

/**
 * Multi-language regex patterns for auto-detecting locale
 */
export const LOCALE_PATTERNS = {
  location: /地点|Where|Location|Destination|目的地|搜索/i,
  dates: /时间|When|Date|Check in|日期|入住/i,
  guests: /人员|Who|Guests|Travelers|房客|人数/i,
  search: /搜索|Search/i,
  currency: /\$[\d,]+|¥[\d,]+|CNY|USD|SGD|EUR/,
};

/**
 * Centralized selectors for Airbnb elements
 */
export const SELECTORS: Record<string, SelectorConfig> = {
  // Search form elements
  searchBox: {
    primary: '[data-testid="structured-search-input-field-query"]',
    fallbacks: [
      '[role="searchbox"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="搜索"]',
      'input[name="query"]',
      '#bigsearch-query-location-input',
    ],
    description: 'Location search input',
  },

  searchButton: {
    primary: '[data-testid="structured-search-input-search-button"]',
    fallbacks: [
      'button[type="submit"]',
      '[data-testid="search-button"]',
      'button:has-text("Search")',
      'button:has-text("搜索")',
    ],
    description: 'Search button',
  },

  dateButton: {
    primary: '[data-testid="structured-search-input-field-dates-button"]',
    fallbacks: [
      'button:has-text("When")',
      'button:has-text("时间")',
      'button:has-text("Check in")',
      'button:has-text("入住")',
    ],
    description: 'Date picker button',
  },

  guestsButton: {
    primary: '[data-testid="structured-search-input-field-guests-button"]',
    fallbacks: [
      'button:has-text("Who")',
      'button:has-text("人员")',
      'button:has-text("Guests")',
      'button:has-text("房客")',
    ],
    description: 'Guests selector button',
  },

  guestsIncrease: {
    primary: '[data-testid="stepper-adults-increase-button"]',
    fallbacks: [
      'button[aria-label*="increase"]',
      'button[aria-label*="增加"]',
      'button:has-text("+")',
    ],
    description: 'Guests increase button',
  },

  // Search results elements
  listingCard: {
    primary: '[data-testid="card-container"]',
    fallbacks: [
      '[itemprop="itemListElement"]',
      '[data-testid="listing-card"]',
      'div[aria-labelledby*="title"]',
    ],
    description: 'Listing card container',
  },

  listingTitle: {
    primary: '[data-testid="listing-card-title"]',
    fallbacks: ['[id*="title"]', '[class*="title"]'],
    description: 'Listing title',
  },

  listingPrice: {
    primary: '[data-testid="price-element"]',
    fallbacks: ['span:has-text("$")', 'span:has-text("¥")', '[class*="price"]'],
    description: 'Listing price',
  },

  listingLink: {
    primary: 'a[href*="/rooms/"]',
    fallbacks: ['a[href*="/room/"]', '[data-testid="listing-link"]'],
    description: 'Listing detail link',
  },

  // Autocomplete/dropdown elements
  locationSuggestions: {
    primary: '[role="listbox"]',
    fallbacks: ['[data-testid="search-suggestions"]', '[class*="suggestions"]'],
    description: 'Location autocomplete dropdown',
  },

  locationOption: {
    primary: '[role="option"]',
    fallbacks: ['[data-testid="search-suggestion"]', 'li[class*="suggestion"]'],
    description: 'Location suggestion option',
  },

  // Calendar elements
  calendar: {
    primary: '[role="application"]',
    fallbacks: ['[data-testid="calendar"]', '[class*="calendar"]'],
    description: 'Date picker calendar',
  },
};

/**
 * Find element using fallback chain
 *
 * @param page - Playwright page instance
 * @param config - Selector configuration with fallbacks
 * @returns Locator if found, null if all selectors fail
 */
export async function findElement(
  page: Page,
  config: SelectorConfig
): Promise<Locator | null> {
  // Try primary selector first
  const primary = page.locator(config.primary);
  if ((await primary.count()) > 0) {
    return primary.first();
  }

  // Try fallback selectors in order
  for (const fallback of config.fallbacks) {
    const element = page.locator(fallback);
    if ((await element.count()) > 0) {
      console.warn(
        `[Selector Fallback] ${config.description}: using "${fallback}"`
      );
      return element.first();
    }
  }

  console.error(
    `[Selector Failed] ${config.description}: no selector matched`
  );
  return null;
}

/**
 * Find element with retry logic
 *
 * @param page - Playwright page instance
 * @param config - Selector configuration with fallbacks
 * @param options - Retry options
 * @returns Locator if found, null if all attempts fail
 */
export async function findElementWithRetry(
  page: Page,
  config: SelectorConfig,
  options: { maxRetries?: number; retryDelay?: number } = {}
): Promise<Locator | null> {
  const { maxRetries = 3, retryDelay = 1000 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const element = await findElement(page, config);
    if (element) {
      return element;
    }

    if (attempt < maxRetries) {
      console.log(
        `[Retry ${attempt}/${maxRetries}] ${config.description}: waiting ${retryDelay}ms`
      );
      await page.waitForTimeout(retryDelay);
    }
  }

  return null;
}
