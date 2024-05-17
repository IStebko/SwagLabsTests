import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage } from "../pageObjects/pages/loginPage";
import { test as base } from "@playwright/test";

export const baseLoginTest = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export const baseItemsTest = baseLoginTest.extend<{
  itemsPage: ItemsPage;
}>({
  itemsPage: async ({ page }, use) => {
    const itemsPage = new ItemsPage(page);
    await use(itemsPage);
  },
});
