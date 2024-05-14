import { test } from "@playwright/test";
import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage } from "../pageObjects/pages/loginPage";
import { CartPage } from "../pageObjects/pages/cartPage";
import { CheckOutOverviewPage } from "../pageObjects/pages/checkOutOverviewPage";
import { CheckOutInformationPage } from "../pageObjects/pages/checkOutInformationPage";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;

let loginPage: LoginPage;
let itemsPage: ItemsPage;
let cartPage: CartPage;
let checkOutOverViewPage: CheckOutOverviewPage;
let checkOutInformationPage: CheckOutInformationPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await page.goto(loginPage.url);
  itemsPage = await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.addArticlesToCart([itemOrder]);
  cartPage = await itemsPage.goToCart();
  checkOutInformationPage = await cartPage.clickCheckoutButton();
});

test("Verify proceeding from Checkout Information Page to Checkout Overview Page", async () => {
  const login = "John";
  const lastName = "Doe";
  const zipCode = "12345";

  checkOutOverViewPage = (await checkOutInformationPage.validCheckout(
    login,
    lastName,
    zipCode
  )) as CheckOutOverviewPage;

  await checkOutOverViewPage.verifyTitle("Checkout: Overview");
});

test("Verify order cancel from the Checkout Information Page", async () => {
  cartPage = await checkOutInformationPage.clickCancelButton();
  await cartPage.verifyTitle("Your Cart");

  await cartPage.verifyCartBadgeCount(1);
});

test.describe
  .parallel("Verify unavailability to checkout with invalid data entered", () => {
  const invalidCredentials = [
    {
      testName: "empty Zip Code",
      firstName: "John",
      lastName: "Doe",
      zipCode: "",
      errorMessage: "Postal Code",
    },
    {
      testName: "empty Last Name",
      firstName: "John",
      lastName: "",
      zipCode: "12345",
      errorMessage: "Last Name",
    },
    {
      testName: "empty First Name",
      firstName: "",
      lastName: "Doe",
      zipCode: "12345",
      errorMessage: "First Name",
    },
  ];
  for (const credential of invalidCredentials) {
    test(`Verify checkout for user with ${credential.testName}`, async () => {
      await checkOutInformationPage.validCheckout(
        credential.firstName,
        credential.lastName,
        credential.zipCode,
        false
      );

      await checkOutInformationPage.verifyErrorText(
        `Error: ${credential.errorMessage} is required`
      );
    });
  }
});
