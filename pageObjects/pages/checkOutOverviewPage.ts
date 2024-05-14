import { ShoppingPage } from "./abstractPages/shoppingPage";
import test, { Page, Locator, expect } from "@playwright/test";
import { ArticleItem } from "../elements/articleItem";
import { CheckOutCompletedPage } from "./checkOutCompletedPage";
import { ItemsPage } from "./itemsPage";

export class CheckOutOverviewPage extends ShoppingPage {
  private orderedItems: Locator;
  private subtotalPrice: Locator;
  private taxPrice: Locator;
  private totalPrice: Locator;
  private cancelButton: Locator;
  private finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.orderedItems = page.locator(".cart_item");
    this.subtotalPrice = page.locator(".summary_subtotal_label");
    this.taxPrice = page.locator(".summary_tax_label");
    this.totalPrice = page.locator(".summary_total_label");
    this.cancelButton = page.locator("id=cancel");
    this.finishButton = page.locator("id=finish");
  }

  public async getOrderedItem(itemOrder: number) {
    return new ArticleItem(this.page, itemOrder);
  }

  public async verifyPricesOfSelectedItems(
    expectedItemPrice: string,
    expectedTaxPrice: string,
    expectedTotalPrice: string
  ) {
    await expect
      .soft(
        this.subtotalPrice,
        `Item price should be be ${expectedItemPrice} but was ${this.subtotalPrice.innerText}`
      )
      .toHaveText(expectedItemPrice);
    await expect
      .soft(
        this.taxPrice,
        `Item price should be be ${expectedTaxPrice} but was ${this.taxPrice.innerText}`
      )
      .toHaveText(expectedTaxPrice);
    await expect
      .soft(
        this.totalPrice,
        `Item price should be be ${expectedTotalPrice} but was ${this.totalPrice.innerText}`
      )
      .toHaveText(expectedTotalPrice);
    return expect(test.info().errors).toHaveLength(0);
  }

  public async verifyOrderedItemsCount(expectedItemsCount: number) {
    await expect(
      this.orderedItems,
      "Incorrect count of items were present on the page"
    ).toHaveCount(expectedItemsCount);
  }

  public async clickCancelButton() {
    await this.cancelButton.click();
    return new ItemsPage(this.page);
  }

  public async clickFinishButton() {
    await this.finishButton.click();
    return new CheckOutCompletedPage(this.page);
  }
}
