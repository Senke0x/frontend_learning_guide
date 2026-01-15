/**
 * Comprehensive popup handler for Airbnb tests
 *
 * Handles various popups that may appear during testing:
 * - Cookie consent banners
 * - Translation/language prompts
 * - Login/signup modals
 * - Tooltip dismissals
 * - Price breakdown modals
 * - Native browser dialogs
 */

import type { Page } from '@playwright/test';

/**
 * Popup pattern configuration
 */
interface PopupPattern {
  /** Identifier for logging */
  name: string;
  /** CSS selectors to try (in order) */
  selectors: string[];
  /** Priority (lower = higher priority) */
  priority: number;
}

/**
 * Popup patterns ordered by priority
 * Lower priority number = checked first
 */
const POPUP_PATTERNS: PopupPattern[] = [
  // Cookie consent - highest priority, often blocks interaction
  {
    name: 'cookie-consent',
    selectors: [
      'button:has-text("Accept all")',
      'button:has-text("Accept cookies")',
      'button:has-text("Accept")',
      'button:has-text("接受全部")',
      'button:has-text("接受")',
      'button:has-text("同意")',
      '[data-testid="accept-cookies-btn"]',
      '[data-testid="cookie-accept"]',
    ],
    priority: 1,
  },

  // Translation/language prompt
  {
    name: 'translation-prompt',
    selectors: [
      'button:has-text("Keep")',
      'button:has-text("保持")',
      'button:has-text("Stay in English")',
      'button:has-text("Stay in")',
      '[aria-label*="translation"]',
      '[aria-label*="翻译"]',
    ],
    priority: 2,
  },

  // Login/signup modal - common on first visit
  {
    name: 'login-modal',
    selectors: [
      '[data-testid="modal-close-button"]',
      'button[aria-label="Close"]',
      'button[aria-label="关闭"]',
      '[aria-label="Close"]',
      '[aria-label="关闭"]',
      'button[class*="close"]',
    ],
    priority: 3,
  },

  // "Got it" tooltips and onboarding
  {
    name: 'tooltip',
    selectors: [
      'button:has-text("Got it")',
      'button:has-text("知道了")',
      'button:has-text("OK")',
      'button:has-text("好的")',
      'button:has-text("Dismiss")',
      'button:has-text("关闭")',
    ],
    priority: 4,
  },

  // Price breakdown and detail modals
  {
    name: 'info-modal',
    selectors: [
      '[aria-label="Close price breakdown"]',
      '[aria-label="关闭价格明细"]',
      'button:has-text("Close")',
      'button:has-text("关闭")',
    ],
    priority: 5,
  },

  // Generic close buttons (last resort)
  {
    name: 'generic-close',
    selectors: [
      'button[aria-label*="close" i]',
      'button[aria-label*="dismiss" i]',
      '[role="dialog"] button:has-text("×")',
    ],
    priority: 6,
  },
];

/**
 * Handles popup dismissal for Airbnb pages
 */
export class PopupHandler {
  private page: Page;
  private dismissedPopups: string[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Dismiss all visible popups
   *
   * @param timeout - Maximum time to spend dismissing popups (ms)
   * @returns Array of dismissed popup names
   */
  async dismissAll(timeout = 5000): Promise<string[]> {
    const dismissed: string[] = [];
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      let foundPopup = false;

      // Check patterns in priority order
      const sortedPatterns = [...POPUP_PATTERNS].sort(
        (a, b) => a.priority - b.priority
      );

      for (const pattern of sortedPatterns) {
        for (const selector of pattern.selectors) {
          try {
            const element = this.page.locator(selector).first();

            // Quick visibility check with short timeout
            if (await element.isVisible({ timeout: 300 })) {
              await element.click({ timeout: 1000 });
              dismissed.push(pattern.name);
              this.dismissedPopups.push(pattern.name);
              foundPopup = true;

              // Small delay after dismissing to allow UI to update
              await this.page.waitForTimeout(300);
              break;
            }
          } catch {
            // Selector not found or click failed, continue to next
            continue;
          }
        }

        if (foundPopup) break;
      }

      // No more popups found, exit loop
      if (!foundPopup) break;
    }

    if (dismissed.length > 0) {
      console.log(`[Popup Handler] Dismissed: ${dismissed.join(', ')}`);
    }

    return dismissed;
  }

  /**
   * Setup automatic dialog handler for native browser dialogs
   * (alert, confirm, prompt, beforeunload)
   */
  setupDialogHandler(): void {
    this.page.on('dialog', async (dialog) => {
      console.log(`[Dialog] Auto-dismissing ${dialog.type()}: "${dialog.message()}"`);
      await dialog.dismiss();
    });
  }

  /**
   * Get list of all popups dismissed in this session
   */
  getDismissedPopups(): string[] {
    return [...this.dismissedPopups];
  }

  /**
   * Check if a specific popup type was dismissed
   */
  wasPopupDismissed(popupName: string): boolean {
    return this.dismissedPopups.includes(popupName);
  }

  /**
   * Dismiss a specific popup type
   *
   * @param popupName - Name of the popup pattern to dismiss
   * @returns true if popup was found and dismissed
   */
  async dismissSpecific(popupName: string): Promise<boolean> {
    const pattern = POPUP_PATTERNS.find((p) => p.name === popupName);
    if (!pattern) {
      console.warn(`[Popup Handler] Unknown popup type: ${popupName}`);
      return false;
    }

    for (const selector of pattern.selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 500 })) {
          await element.click({ timeout: 1000 });
          this.dismissedPopups.push(pattern.name);
          console.log(`[Popup Handler] Dismissed: ${pattern.name}`);
          return true;
        }
      } catch {
        continue;
      }
    }

    return false;
  }
}
