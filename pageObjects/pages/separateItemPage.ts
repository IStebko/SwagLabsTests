import { Locator, Page } from "@playwright/test";
import { ShoppingPage } from "./abstractPages/shoppingPage";

export class SeparateItemPage extends ShoppingPage {
  private readonly itemTitle: Locator;
  private readonly addButton: Locator;
  private readonly removeButton: Locator;
  private readonly backToProductsLink: Locator;

  constructor(page: Page) {
    super(page);

    this.itemTitle = page.locator("[data-test='inventory-item-name']");
    this.addButton = page.locator("id=add-to-cart");
    this.removeButton = page.locator("id=remove");
    this.backToProductsLink = page.locator("id=back-to-products");
  }

  public async addItemToCart() {
    return await this.addButton.click();
  }

  public async removeItemFromCart() {
    return await this.removeButton.click();
  }

  public async clickBackToProducts() {
    return await this.backToProductsLink.click();
  }

  public async getTitle() {
    return await this.itemTitle.innerText();
  }
}
