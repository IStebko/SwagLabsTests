import { test } from "@playwright/test";
import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage } from "../pageObjects/pages/loginPage";
import { CartPage } from "../pageObjects/pages/cartPage";
import { CheckOutOverviewPage } from "../pageObjects/pages/checkOutOverviewPage";
import { CheckOutInformationPage } from "../pageObjects/pages/checkOutInformationPage";
import { CheckOutCompletedPage } from "../pageObjects/pages/checkOutCompletedPage";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;

let loginPage: LoginPage;
let itemsPage: ItemsPage;
let cartPage: CartPage;
let checkOutOverViewPage: CheckOutOverviewPage;
let checkOutInformationPage: CheckOutInformationPage;
let checkOutCompletedPage: CheckOutCompletedPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await page.goto(loginPage.url);
  itemsPage = await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.addArticlesToCart([itemOrder]);
  cartPage = await itemsPage.goToCart();
  checkOutInformationPage = await cartPage.clickCheckoutButton();
  checkOutOverViewPage = (await checkOutInformationPage.validCheckout(
    "John",
    "Doe",
    "12345"
  )) as CheckOutOverviewPage;
});

test("Verify proceeding from Checkout Overview Page to Checkout Completed Page", async () => {
  checkOutCompletedPage = await checkOutOverViewPage.clickFinishButton();

  await checkOutCompletedPage.verifyTitle("Checkout: Complete!");
  await checkOutCompletedPage.verifyCompletedOrderTitle();
  await checkOutCompletedPage.verifyCartBadgeCount(0);
});

test("Verify proceeding from Checkout Completed Page to Items Page", async () => {
  checkOutCompletedPage = await checkOutOverViewPage.clickFinishButton();
  itemsPage = await checkOutCompletedPage.clickBackHomeButton();

  await itemsPage.verifyTitle("Products");
});
