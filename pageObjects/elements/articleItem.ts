import { expect, Locator, Page } from "@playwright/test";
import { SeparateItemPage } from "../pages/separateItemPage";

export class ArticleItem {
  private readonly page: Page;

  private readonly quantity: Locator;
  private readonly title: Locator;
  private readonly description: Locator;
  private readonly price: Locator;
  private readonly addButton: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page, itemOrder: number) {
    this.page = page;

    this.quantity = page.locator(".cart_quantity").nth(itemOrder);
    this.title = page.locator(".inventory_item_name").nth(itemOrder);
    this.description = page.locator(".inventory_item_desc").nth(itemOrder);
    this.price = page.locator(".inventory_item_price").nth(itemOrder);
    this.addButton = page
      .locator('button[data-test*="add-to-cart"]')
      .nth(itemOrder);
    this.removeButton = page
      .locator('button[data-test*="remove-sauce-labs"]')
      .nth(itemOrder);
  }

  public async openDetailedItemPage() {
    await this.title.click();
    return new SeparateItemPage(this.page);
  }

  public async getQuantity() {
    return this.quantity.innerText();
  }

  public async getTitle() {
    return this.title.innerText();
  }

  public async getDescription() {
    return this.description.innerText();
  }

  public async getPrice() {
    return this.price.innerText();
  }

  public async removeItem() {
    await this.removeButton.click();
  }

  public async addItem() {
    await this.addButton.click();
  }

  public async verifyArticleTitle(expectedTitle: string) {
    return expect(
      this.title,
      `Item title should be ${expectedTitle} but was ${this.title.innerText()}`
    ).toHaveText(expectedTitle);
  }
}
