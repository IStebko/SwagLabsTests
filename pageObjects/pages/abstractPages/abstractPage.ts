import { expect, Locator, Page } from "@playwright/test";

export abstract class AbstractPage {
  protected readonly page: Page;

  private readonly title: Locator;
  private readonly error: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator(".title");
    this.error = page.locator("[data-test='error']");
  }

  public async navigateToUrl(url: string) {
    await this.page.goto(url);
  }

  public async verifyTitle(expectedText: string) {
    return expect(
      this.title,
      `Page title should be ${expectedText} but was ${this.title.innerText}`
    ).toHaveText(expectedText);
  }

  public async verifyErrorText(expectedText: string) {
    return expect(
      this.error,
      `Error message should be ${expectedText} but was ${this.error.innerText}`
    ).toHaveText(expectedText);
  }

  public async verifyTextsAreEqual(actualText: string, expectedText: string) {
    expect(
      actualText,
      `Actual text was ${actualText}, should be ${expectedText}`
    ).toEqual(expectedText);
  }
}
