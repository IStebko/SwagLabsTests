import { SeparateItemPage } from "../pageObjects/pages/separateItemPage";
import { baseItemsTest } from "./loginFixture";
import { CartPage } from "../pageObjects/pages/cartPage";
import { CheckOutCompletedPage } from "../pageObjects/pages/checkOutCompletedPage";
import { CheckOutInformationPage } from "../pageObjects/pages/checkOutInformationPage";
import { CheckOutOverviewPage } from "../pageObjects/pages/checkOutOverviewPage";

export const itemsOperationsTest = baseItemsTest.extend<{
  cartPage: CartPage;
  checkOutCompletedPage: CheckOutCompletedPage;
  checkOutInformationPage: CheckOutInformationPage;
  checkOutOverviewPage: CheckOutOverviewPage;
  separateItemPage: SeparateItemPage;
}>({
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkOutCompletedPage: async ({ page }, use) => {
    const checkOutCompletedPage = new CheckOutCompletedPage(page);
    await use(checkOutCompletedPage);
  },
  checkOutInformationPage: async ({ page }, use) => {
    const checkOutInformationPage = new CheckOutInformationPage(page);
    await use(checkOutInformationPage);
  },
  checkOutOverviewPage: async ({ page }, use) => {
    const checkOutOverviewPage = new CheckOutOverviewPage(page);
    await use(checkOutOverviewPage);
  },
  separateItemPage: async ({ page }, use) => {
    const separateItemPage = new SeparateItemPage(page);
    await use(separateItemPage);
  },
});
