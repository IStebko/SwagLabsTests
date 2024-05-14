import { expect, Locator, Page } from "@playwright/test";
import { ShoppingPage } from "./abstractPages/shoppingPage";
import { ArticleItem } from "../elements/articleItem";
import { CheckOutInformationPage } from "./checkOutInformationPage";

export class CartPage extends ShoppingPage {
  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkOutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator(".cart_item");
    this.continueShoppingButton = page.locator("id=continue-shopping");
    this.checkOutButton = page.locator("id=checkout");
  }

  public async getCartItem(itemOrder: number) {
    return new ArticleItem(this.page, itemOrder);
  }

  public async verifyItemsCount(expectedItemsCount: number) {
    return expect(
      this.cartItems,
      "Incorrect count of items were present on the page"
    ).toHaveCount(expectedItemsCount);
  }

  public async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  public async clickCheckoutButton() {
    await this.checkOutButton.click();
    return new CheckOutInformationPage(this.page);
  }
}
