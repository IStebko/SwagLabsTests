import { itemsOperationsTest } from "../fixtures/itemsOperationsFixture";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const item1 = items[0];
const item2 = items[1];

itemsOperationsTest.beforeEach(async ({ loginPage, itemsPage, cartPage }) => {
  await loginPage.navigateToUrl(loginPage.url);
  await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.addArticlesToCart([item1.test_case, item2.test_case]);
  await itemsPage.goToCart();
  await cartPage.clickCheckoutButton();
});

itemsOperationsTest(
  "Verify added items on Checkout Overview page ",
  async ({ checkOutOverviewPage, checkOutInformationPage }) => {
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

    await checkOutInformationPage.validCheckout("John", "Doe", "12345");

    await checkOutOverviewPage.verifyOrderedItemsCount(2);
    await checkOutOverviewPage.verifyPricesOfSelectedItems(
      itemsTotalPrice,
      taxPrice,
      totalPrice
    );
    await checkOutOverviewPage.verifyCartBadgeCount(2);
  }
);

itemsOperationsTest(
  "Verify order cancel from the Checkout Overview Page",
  async ({ checkOutInformationPage, checkOutOverviewPage, itemsPage }) => {
    await checkOutInformationPage.validCheckout("John", "Doe", "12345");
    await checkOutOverviewPage.clickCancelButton();

    await itemsPage.verifyTitle("Products");
    await itemsPage.verifyCartBadgeCount(2);
  }
);
