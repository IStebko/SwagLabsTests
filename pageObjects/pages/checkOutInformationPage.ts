import { ShoppingPage } from "./abstractPages/shoppingPage";
import { Page, Locator } from "@playwright/test";
import { CheckOutOverviewPage } from "./checkOutOverviewPage";
import { CartPage } from "./cartPage";

export class CheckOutInformationPage extends ShoppingPage {
  private firstNameInputField: Locator;
  private lastNameInputField: Locator;
  private zipCodeField: Locator;
  private cancelButton: Locator;
  private continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInputField = this.page.locator("id=first-name");
    this.lastNameInputField = this.page.locator("id=last-name");
    this.zipCodeField = this.page.locator("id=postal-code");
    this.cancelButton = this.page.locator("id=cancel");
    this.continueButton = this.page.locator("id=continue");
  }

  public async validCheckout(
    firstName: string,
    lastName: string,
    zipCode: string,
    isValid = true
  ) {
    await this.firstNameInputField.fill(firstName);
    await this.lastNameInputField.fill(lastName);
    await this.zipCodeField.fill(zipCode);
    await this.continueButton.click();
    if (isValid) {
      return new CheckOutOverviewPage(this.page);
    }
  }

  public async clickCancelButton() {
    await this.cancelButton.click();
    return new CartPage(this.page);
  }
}
