/**
 * Airbnb 搜索自动化测试
 *
 * 功能：自动打开 Airbnb，搜索纽约下周的房源，并提取搜索结果信息
 *
 * 关键技术点：
 * 1. 日期选择器处理 - 动态计算"下周"日期
 * 2. 等待搜索结果加载 - 使用 waitForResponse/waitForSelector
 * 3. 提取房源信息 - 名称、价格、评分等
 */

import { test, expect, type Page, type Locator } from '@playwright/test';

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

  // 搜索表单元素
  readonly locationInput: Locator;
  readonly dateButton: Locator;
  readonly guestsButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 使用多种选择器策略，提高稳定性
    this.locationInput = page.getByRole('searchbox', { name: /地点|Where|Location/i });
    this.dateButton = page.getByRole('button', { name: /时间|When|Date/i }).first();
    this.guestsButton = page.getByRole('button', { name: /人员|Who|Guests/i }).first();
    this.searchButton = page.getByTestId('structured-search-input-search-button');
  }

  /**
   * 导航到 Airbnb 首页
   */
  async goto(): Promise<void> {
    await this.page.goto('https://www.airbnb.com', {
      waitUntil: 'domcontentloaded',
    });
    // 等待搜索框可见
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * 输入搜索地点
   */
  async enterLocation(location: string): Promise<void> {
    // 点击地点输入框
    await this.locationInput.click();
    await this.locationInput.fill(location);

    // 等待搜索建议出现
    await this.page.waitForSelector('[role="listbox"]', { timeout: 10000 });

    // 点击第一个搜索建议
    const firstSuggestion = this.page.locator('[role="option"]').first();
    await firstSuggestion.waitFor({ state: 'visible' });
    await firstSuggestion.click();
  }

  /**
   * 选择日期
   * @param checkIn 入住日期
   * @param checkOut 退房日期
   */
  async selectDates(checkIn: Date, checkOut: Date): Promise<void> {
    // 等待日历出现（选择地点后通常会自动展开）
    const calendar = this.page.locator('[role="application"]').filter({ hasText: /日历|Calendar/i });

    // 如果日历没有自动展开，手动点击日期按钮
    const isCalendarVisible = await calendar.isVisible().catch(() => false);
    if (!isCalendarVisible) {
      await this.dateButton.click();
      await calendar.waitFor({ state: 'visible', timeout: 5000 });
    }

    // 选择入住日期
    const checkInPattern = formatDateForAirbnb(checkIn);
    const checkInButton = this.page.getByRole('button', { name: new RegExp(checkInPattern, 'i') });
    await checkInButton.click();

    // 选择退房日期
    const checkOutPattern = formatDateForAirbnb(checkOut);
    const checkOutButton = this.page.getByRole('button', { name: new RegExp(checkOutPattern, 'i') });
    await checkOutButton.click();
  }

  /**
   * 设置成人人数
   */
  async setAdults(count: number): Promise<void> {
    // 点击人员按钮
    await this.guestsButton.click();

    // 等待人数选择器出现
    const increaseButton = this.page.getByTestId('stepper-adults-increase-button');
    await increaseButton.waitFor({ state: 'visible', timeout: 5000 });

    // 点击增加按钮
    for (let i = 0; i < count; i++) {
      await increaseButton.click();
      // 短暂等待，避免点击过快
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * 执行搜索
   */
  async search(): Promise<void> {
    // 点击搜索按钮
    await this.searchButton.click();

    // 等待 URL 变化（表示导航到搜索结果页）
    await this.page.waitForURL(/\/s\//, { timeout: 30000 });

    // 等待搜索结果加载
    await this.waitForSearchResults();
  }

  /**
   * 等待搜索结果加载完成
   */
  async waitForSearchResults(): Promise<void> {
    // 方法1: 等待房源卡片出现
    const listingCard = this.page.locator('[data-testid="card-container"]').first();

    // 方法2: 备用 - 等待包含价格信息的元素
    const priceElement = this.page.locator('text=/\\$\\d+|SGD|CNY/').first();

    // 等待任一元素出现
    await Promise.race([
      listingCard.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      priceElement.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
    ]);

    // 额外等待确保内容完全加载
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  /**
   * 提取搜索结果中的房源信息
   */
  async extractListings(maxCount = 10): Promise<ListingInfo[]> {
    const listings: ListingInfo[] = [];

    // 使用多种选择器策略找到房源卡片
    const cards = this.page.locator('[data-testid="card-container"], [itemprop="itemListElement"]');
    const cardCount = await cards.count();
    const actualCount = Math.min(cardCount, maxCount);

    for (let i = 0; i < actualCount; i++) {
      const card = cards.nth(i);

      try {
        // 提取房源名称
        const nameElement = card.locator('[data-testid="listing-card-title"], [id*="title"]').first();
        const name = await nameElement.textContent().catch(() => null);

        // 提取价格
        const priceElement = card.locator('text=/\\$[\\d,]+|¥[\\d,]+/').first();
        const price = await priceElement.textContent().catch(() => null);

        // 提取评分
        const ratingElement = card.locator('[aria-label*="rating"], text=/\\d+\\.\\d+/').first();
        const rating = await ratingElement.textContent().catch(() => null);

        // 提取链接
        const linkElement = card.locator('a[href*="/rooms/"]').first();
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
   */
  async dismissPopups(): Promise<void> {
    const popupSelectors = [
      'button:has-text("Got it")',
      'button:has-text("知道了")',
      'button:has-text("Accept")',
      'button:has-text("接受")',
      'button:has-text("Close")',
      'button:has-text("关闭")',
      '[aria-label="Close"]',
    ];

    for (const selector of popupSelectors) {
      const button = this.page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click().catch(() => {});
        await this.page.waitForTimeout(500);
      }
    }
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

    const searchPage = new AirbnbSearchPage(page);
    await searchPage.dismissPopups();

    // 滚动页面以加载更多房源
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1000);
    }

    // 提取所有可见房源
    const listings = await searchPage.extractListings(20);

    // 输出 JSON 格式
    console.log(JSON.stringify(listings, null, 2));
  });
});
