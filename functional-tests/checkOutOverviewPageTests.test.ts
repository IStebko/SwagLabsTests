import { test } from "@playwright/test";
import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage } from "../pageObjects/pages/loginPage";
import { CartPage } from "../pageObjects/pages/cartPage";
import { CheckOutOverviewPage } from "../pageObjects/pages/checkOutOverviewPage";
import { CheckOutInformationPage } from "../pageObjects/pages/checkOutInformationPage";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const item1 = items[0];
const item2 = items[1];
const login = "John";
const lastName = "Doe";
const zipCode = "12345";

let loginPage: LoginPage;
let itemsPage: ItemsPage;
let cartPage: CartPage;
let checkOutOverViewPage: CheckOutOverviewPage;
let checkOutInformationPage: CheckOutInformationPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await page.goto(loginPage.url);
  itemsPage = await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.addArticlesToCart([item1.test_case, item2.test_case]);
  cartPage = await itemsPage.goToCart();
  checkOutInformationPage = await cartPage.clickCheckoutButton();
});

test("Verify added items on Checkout Overview page ", async () => {
  let expectedItemPrice1 = Number(item1.item_price);
  let expectedItemPrice2 = Number(item2.item_price);
  let taxPriceValue = 3.68;

  let itemsTotalPrice = `Item total: $${
    expectedItemPrice1 + expectedItemPrice2
  }`;
  let taxPrice = `Tax: $${taxPriceValue}`;
  let totalPrice = `Total: $${
    expectedItemPrice1 + expectedItemPrice2 + taxPriceValue
  }`;

  checkOutOverViewPage = (await checkOutInformationPage.validCheckout(
    login,
    lastName,
    zipCode
  )) as CheckOutOverviewPage;

  await checkOutOverViewPage.verifyOrderedItemsCount(2);
  await checkOutOverViewPage.verifyPricesOfSelectedItems(
    itemsTotalPrice,
    taxPrice,
    totalPrice
  );
  await checkOutOverViewPage.verifyCartBadgeCount(2);
});

test("Verify order cancel from the Checkout Overview Page", async () => {
  checkOutOverViewPage = (await checkOutInformationPage.validCheckout(
    login,
    lastName,
    zipCode
  )) as CheckOutOverviewPage;
  itemsPage = await checkOutOverViewPage.clickCancelButton();

  await itemsPage.verifyTitle("Products");
  await itemsPage.verifyCartBadgeCount(2);
});
