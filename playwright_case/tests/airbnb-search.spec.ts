/**
 * Airbnb 搜索自动化测试
 *
 * 功能：自动打开 Airbnb，搜索纽约下周的房源，并提取搜索结果信息
 *
 * 关键技术点：
 * 1. 日期选择器处理 - 动态计算"下周"日期
 * 2. 等待搜索结果加载 - 使用 waitForResponse/waitForSelector
 * 3. 提取房源信息 - 名称、价格、评分等
 *
 * 改进特性：
 * - 随机延迟防止反爬检测
 * - 多语言选择器自动适配
 * - 选择器降级策略
 * - 全面的弹窗处理
 */

import { test, expect, type Page, type Locator } from '@playwright/test';

// 导入工具函数
import { randomDelay, humanClick, humanWait, humanScroll } from '../utils/anti-detection';
import { PopupHandler } from '../utils/popup-handler';
import {
  SELECTORS,
  LOCALE_PATTERNS,
  findElement,
  findElementWithRetry,
} from '../selectors/airbnb-selectors';

// ============================================================================
// 类型定义
// ============================================================================

/** 房源信息结构 */
interface ListingInfo {
  name: string;
  price: string | null;
  rating: string | null;
  url: string | null;
}

/** 搜索参数 */
interface SearchParams {
  location: string;
  checkInDate: Date;
  checkOutDate: Date;
  adults?: number;
  children?: number;
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取下周一的日期
 */
function getNextMonday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday;
}

/**
 * 获取指定天数后的日期
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 格式化日期为 Airbnb 按钮文本的部分匹配模式
 * 例如: "19, Monday, January 2026"
 */
function formatDateForAirbnb(date: Date): string {
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day}, ${weekday}, ${month} ${year}`;
}

/**
 * 格式化日期为 URL 参数格式
 * 例如: "2026-01-19"
 */
function formatDateForUrl(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================================
// Page Object: Airbnb 搜索页面
// ============================================================================

class AirbnbSearchPage {
  readonly page: Page;
  readonly popupHandler: PopupHandler;

  // 搜索表单元素 - 使用多语言正则匹配
  readonly locationInput: Locator;
  readonly dateButton: Locator;
  readonly guestsButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupHandler = new PopupHandler(page);

    // 设置自动处理浏览器原生对话框
    this.popupHandler.setupDialogHandler();

    // 使用多语言选择器策略，提高稳定性
    this.locationInput = page.getByRole('searchbox', { name: LOCALE_PATTERNS.location });
    this.dateButton = page.getByRole('button', { name: LOCALE_PATTERNS.dates }).first();
    this.guestsButton = page.getByRole('button', { name: LOCALE_PATTERNS.guests }).first();
    this.searchButton = page.getByTestId('structured-search-input-search-button');
  }

  /**
   * 导航到 Airbnb 首页
   */
  async goto(): Promise<void> {
    await this.page.goto('https://www.airbnb.com', {
      waitUntil: 'domcontentloaded',
    });

    // 随机延迟模拟人类行为
    await randomDelay(1000, 2000);

    // 等待搜索框可见
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });

    // 首次加载后处理弹窗
    await this.popupHandler.dismissAll();
  }

  /**
   * 输入搜索地点
   */
  async enterLocation(location: string): Promise<void> {
    // 点击地点输入框（使用人性化点击）
    await humanClick(this.locationInput);
    await randomDelay(300, 600);
    await this.locationInput.fill(location);

    // 等待搜索建议出现（使用降级选择器）
    const suggestions = await findElementWithRetry(this.page, SELECTORS.locationSuggestions);
    if (!suggestions) {
      // 降级：直接等待 role="listbox"
      await this.page.waitForSelector('[role="listbox"]', { timeout: 10000 });
    }

    // 随机延迟后选择第一个建议
    await randomDelay(500, 1000);

    // 点击第一个搜索建议（使用降级选择器）
    const firstOption = await findElement(this.page, SELECTORS.locationOption);
    if (firstOption) {
      await humanClick(firstOption);
    } else {
      // 降级处理
      const fallbackOption = this.page.locator('[role="option"]').first();
      await fallbackOption.waitFor({ state: 'visible' });
      await humanClick(fallbackOption);
    }
  }

  /**
   * 选择日期
   * @param checkIn 入住日期
   * @param checkOut 退房日期
   */
  async selectDates(checkIn: Date, checkOut: Date): Promise<void> {
    // 等待日历出现（选择地点后通常会自动展开）
    const calendar = await findElement(this.page, SELECTORS.calendar);

    // 如果日历没有自动展开，手动点击日期按钮
    const isCalendarVisible = calendar ? await calendar.isVisible().catch(() => false) : false;
    if (!isCalendarVisible) {
      await humanClick(this.dateButton);
      await randomDelay(500, 1000);
      // 重新检查日历
      const calendarRetry = this.page.locator('[role="application"]');
      await calendarRetry.waitFor({ state: 'visible', timeout: 5000 });
    }

    // 随机延迟后选择入住日期
    await randomDelay(300, 600);
    const checkInPattern = formatDateForAirbnb(checkIn);
    const checkInButton = this.page.getByRole('button', { name: new RegExp(checkInPattern, 'i') });
    await humanClick(checkInButton);

    // 随机延迟后选择退房日期
    await randomDelay(300, 600);
    const checkOutPattern = formatDateForAirbnb(checkOut);
    const checkOutButton = this.page.getByRole('button', { name: new RegExp(checkOutPattern, 'i') });
    await humanClick(checkOutButton);
  }

  /**
   * 设置成人人数
   */
  async setAdults(count: number): Promise<void> {
    // 点击人员按钮
    await humanClick(this.guestsButton);
    await randomDelay(500, 800);

    // 等待人数选择器出现（使用降级选择器）
    let increaseButton = await findElement(this.page, SELECTORS.guestsIncrease);
    if (!increaseButton) {
      // 降级到直接使用 testid
      increaseButton = this.page.getByTestId('stepper-adults-increase-button');
      await increaseButton.waitFor({ state: 'visible', timeout: 5000 });
    }

    // 点击增加按钮（使用随机延迟）
    for (let i = 0; i < count; i++) {
      await humanClick(increaseButton);
      // 随机等待，模拟人类操作
      await randomDelay(300, 700);
    }
  }

  /**
   * 执行搜索
   */
  async search(): Promise<void> {
    // 随机延迟后点击搜索按钮
    await randomDelay(500, 1000);
    await humanClick(this.searchButton);

    // 等待 URL 变化（表示导航到搜索结果页）
    await this.page.waitForURL(/\/s\//, { timeout: 30000 });

    // 等待搜索结果加载
    await this.waitForSearchResults();

    // 搜索结果页处理弹窗
    await this.popupHandler.dismissAll();
  }

  /**
   * 等待搜索结果加载完成
   */
  async waitForSearchResults(): Promise<void> {
    // 方法1: 使用降级选择器等待房源卡片
    const listingCard = await findElement(this.page, SELECTORS.listingCard);

    // 方法2: 备用 - 等待包含价格信息的元素（多货币支持）
    const priceElement = this.page.locator(`text=${LOCALE_PATTERNS.currency.source}`).first();

    // 等待任一元素出现
    await Promise.race([
      listingCard?.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      priceElement.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      // 降级：直接等待卡片容器
      this.page.locator('[data-testid="card-container"]').first()
        .waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
    ]);

    // 额外等待确保内容完全加载
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // 随机延迟模拟人类阅读
    await randomDelay(1000, 2000);
  }

  /**
   * 提取搜索结果中的房源信息
   */
  async extractListings(maxCount = 10): Promise<ListingInfo[]> {
    const listings: ListingInfo[] = [];

    // 使用降级选择器策略找到房源卡片
    const primarySelector = SELECTORS.listingCard.primary;
    const fallbackSelectors = SELECTORS.listingCard.fallbacks.join(', ');
    const cards = this.page.locator(`${primarySelector}, ${fallbackSelectors}`);
    const cardCount = await cards.count();
    const actualCount = Math.min(cardCount, maxCount);

    console.log(`[Extraction] Found ${cardCount} cards, extracting ${actualCount}`);

    for (let i = 0; i < actualCount; i++) {
      const card = cards.nth(i);

      try {
        // 提取房源名称（使用降级选择器）
        const titleSelectors = [
          SELECTORS.listingTitle.primary,
          ...SELECTORS.listingTitle.fallbacks,
        ].join(', ');
        const nameElement = card.locator(titleSelectors).first();
        const name = await nameElement.textContent().catch(() => null);

        // 提取价格（多货币支持）
        const priceElement = card.locator(`text=${LOCALE_PATTERNS.currency.source}`).first();
        const price = await priceElement.textContent().catch(() => null);

        // 提取评分
        const ratingElement = card.locator('[aria-label*="rating"], text=/\\d+\\.\\d+/').first();
        const rating = await ratingElement.textContent().catch(() => null);

        // 提取链接（使用降级选择器）
        const linkSelectors = [
          SELECTORS.listingLink.primary,
          ...SELECTORS.listingLink.fallbacks,
        ].join(', ');
        const linkElement = card.locator(linkSelectors).first();
        const url = await linkElement.getAttribute('href').catch(() => null);

        if (name) {
          listings.push({
            name: name.trim(),
            price: price?.trim() || null,
            rating: rating?.trim() || null,
            url,
          });
        }
      } catch {
        // 跳过无法解析的卡片
        continue;
      }
    }

    return listings;
  }

  /**
   * 处理可能出现的弹窗（如 Cookie 提示、翻译提示等）
   * @deprecated 使用 popupHandler.dismissAll() 代替
   */
  async dismissPopups(): Promise<void> {
    await this.popupHandler.dismissAll();
  }

  /**
   * 获取已处理的弹窗列表
   */
  getDismissedPopups(): string[] {
    return this.popupHandler.getDismissedPopups();
  }
}

// ============================================================================
// 测试用例
// ============================================================================

test.describe('Airbnb 搜索自动化', () => {
  // 配置测试超时时间（搜索可能较慢）
  test.setTimeout(120000);

  let searchPage: AirbnbSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new AirbnbSearchPage(page);
  });

  test('搜索纽约下周房源并提取结果', async ({ page }) => {
    // Step 1: 计算下周日期
    const checkInDate = getNextMonday();
    const checkOutDate = addDays(checkInDate, 6); // 住6晚

    console.log('搜索参数:');
    console.log(`  入住: ${checkInDate.toLocaleDateString()}`);
    console.log(`  退房: ${checkOutDate.toLocaleDateString()}`);

    // Step 2: 打开 Airbnb
    await searchPage.goto();

    // Step 3: 处理可能的弹窗
    await searchPage.dismissPopups();

    // Step 4: 输入搜索地点
    await searchPage.enterLocation('New York');

    // Step 5: 选择日期
    await searchPage.selectDates(checkInDate, checkOutDate);

    // Step 6: 设置人数（2位成人）
    await searchPage.setAdults(2);

    // Step 7: 执行搜索
    await searchPage.search();

    // Step 8: 再次处理可能的弹窗
    await searchPage.dismissPopups();

    // Step 9: 验证搜索结果
    // 验证 URL 包含搜索参数
    const currentUrl = page.url();
    expect(currentUrl).toContain('/s/');

    // Step 10: 提取房源信息
    const listings = await searchPage.extractListings(5);
    console.log('\n搜索结果:');
    console.log(`找到 ${listings.length} 个房源`);

    listings.forEach((listing, index) => {
      console.log(`\n房源 ${index + 1}:`);
      console.log(`  名称: ${listing.name}`);
      console.log(`  价格: ${listing.price || '未知'}`);
      console.log(`  评分: ${listing.rating || '未知'}`);
      console.log(`  链接: ${listing.url || '未知'}`);
    });

    // 验证至少找到一个房源
    expect(listings.length).toBeGreaterThan(0);

    // 验证房源信息完整性
    const firstListing = listings[0];
    expect(firstListing.name).toBeTruthy();
  });

  test('使用 URL 参数直接搜索（更快速稳定的方式）', async ({ page }) => {
    // 计算日期
    const checkInDate = getNextMonday();
    const checkOutDate = addDays(checkInDate, 6);

    // 构建搜索 URL
    const searchParams = new URLSearchParams({
      query: 'New York',
      checkin: formatDateForUrl(checkInDate),
      checkout: formatDateForUrl(checkOutDate),
      adults: '2',
    });

    const searchUrl = `https://www.airbnb.com/s/New-York--NY--United-States/homes?${searchParams.toString()}`;

    console.log('直接访问搜索 URL:', searchUrl);

    // 直接导航到搜索结果页
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    // 随机延迟模拟人类行为
    await randomDelay(1000, 2000);

    // 等待搜索结果加载
    await searchPage.waitForSearchResults();

    // 处理弹窗
    await searchPage.dismissPopups();

    // 提取房源信息
    const listings = await searchPage.extractListings(10);
    console.log(`\n通过 URL 参数搜索找到 ${listings.length} 个房源`);

    // 验证结果
    expect(listings.length).toBeGreaterThan(0);

    // 输出详细信息
    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.name} - ${listing.price || 'N/A'}`);
    });

    // 输出已处理的弹窗
    const dismissedPopups = searchPage.getDismissedPopups();
    if (dismissedPopups.length > 0) {
      console.log(`\n已处理弹窗: ${dismissedPopups.join(', ')}`);
    }
  });
});

// ============================================================================
// 独立运行的爬取脚本（可选）
// ============================================================================

test.describe('Airbnb 数据提取工具', () => {
  test.skip('提取指定页面的所有房源信息', async ({ page }) => {
    // 这个测试可以用于单独提取数据，默认跳过
    const targetUrl =
      'https://www.airbnb.com/s/New-York--NY--United-States/homes?adults=2&checkin=2026-01-19&checkout=2026-01-25';

    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    // 随机延迟
    await randomDelay(1000, 2000);

    const extractPage = new AirbnbSearchPage(page);
    await extractPage.dismissPopups();

    // 滚动页面以加载更多房源（使用人性化滚动）
    for (let i = 0; i < 3; i++) {
      await humanScroll(page, 'down', 800);
      await randomDelay(800, 1500);
    }

    // 提取所有可见房源
    const listings = await extractPage.extractListings(20);

    // 输出 JSON 格式
    console.log(JSON.stringify(listings, null, 2));
  });
});
