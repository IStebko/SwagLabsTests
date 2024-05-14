import { ShoppingPage } from "./abstractPages/shoppingPage";
import { Page, Locator, expect } from "@playwright/test";
import { ItemsPage } from "./itemsPage";

export class CheckOutCompletedPage extends ShoppingPage {
  private backHomeButton: Locator;
  private thankYouTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.thankYouTitle = page.locator("data-test=complete-header");
    this.backHomeButton = page.locator("id=back-to-products");
  }

  public async clickBackHomeButton() {
    await this.backHomeButton.click();
    return new ItemsPage(this.page);
  }

  public async verifyCompletedOrderTitle() {
    return expect(
      this.thankYouTitle,
      "Thank you title was not displayed"
    ).toBeVisible();
  }
}
