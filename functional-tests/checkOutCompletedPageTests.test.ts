import { itemsOperationsTest } from "../fixtures/itemsOperationsFixture";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;

itemsOperationsTest.beforeEach(
  async ({ loginPage, itemsPage, cartPage, checkOutInformationPage }) => {
    await loginPage.navigateToUrl(loginPage.url);
    await loginPage.logInAsSpecificUser("standard user");
    await itemsPage.addArticlesToCart([itemOrder]);
    await itemsPage.goToCart();
    await cartPage.clickCheckoutButton();
    await checkOutInformationPage.validCheckout("John", "Doe", "12345");
  }
);

itemsOperationsTest(
  "Verify proceeding from Checkout Overview Page to Checkout Completed Page",
  async ({ checkOutOverviewPage, checkOutCompletedPage }) => {
    await checkOutOverviewPage.clickFinishButton();

    await checkOutCompletedPage.verifyTitle("Checkout: Complete!");
    await checkOutCompletedPage.verifyCompletedOrderTitle();
    await checkOutCompletedPage.verifyCartBadgeCount(0);
  }
);

itemsOperationsTest(
  "Verify proceeding from Checkout Completed Page to Items Page",
  async ({ checkOutOverviewPage, checkOutCompletedPage, itemsPage }) => {
    await checkOutOverviewPage.clickFinishButton();
    await checkOutCompletedPage.clickBackHomeButton();

    await itemsPage.verifyTitle("Products");
  }
);
