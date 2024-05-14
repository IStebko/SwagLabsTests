import { test, expect } from "@playwright/test";
import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage, SortOrder } from "../pageObjects/pages/loginPage";

let loginPage: LoginPage;
let itemsPage: ItemsPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await page.goto(loginPage.url);
  itemsPage = await new LoginPage(page).logInAsSpecificUser("standard user");
});

test.describe.parallel("Price sorting drop-down verification", () => {
  const testCases = [
    { sortingOption: SortOrder.priceLowToHigh },
    { sortingOption: SortOrder.priceHighToLow },
  ];

  for (const testCase of testCases) {
    test(`Verify sorting by item price ${testCase.sortingOption}`, async () => {
      await itemsPage.selectValueInDropDown(testCase.sortingOption);
      const prices = (await itemsPage.getInventoryItemPrices.allInnerTexts())
        .map((price) => price.replace("$", ""))
        .map(Number);
      var sortedPrices: Array<number> = [];
      switch (testCase.sortingOption) {
        case SortOrder.priceLowToHigh:
          sortedPrices = prices.slice().sort((a, b) => a - b);
          break;
        case SortOrder.priceHighToLow:
          sortedPrices = prices.slice().sort((a, b) => b - a);
          break;
      }

      itemsPage.verifySortedValues(prices, sortedPrices);
    });
  }
});

test.describe.parallel("Name sorting drop-down verification", () => {
  const testCases = [
    { sortingOption: SortOrder.nameAtoZ },
    { sortingOption: SortOrder.nameZtoA },
  ];

  for (const testCase of testCases) {
    test(`Verify sorting by item name ${testCase.sortingOption}`, async () => {
      await itemsPage.selectValueInDropDown(testCase.sortingOption);
      const itemNames = await itemsPage.getInventoryItemNames.allInnerTexts();
      var sortedNames: Array<string> = [];
      switch (testCase.sortingOption) {
        case SortOrder.nameAtoZ:
          sortedNames = itemNames.slice().sort();
          break;
        case SortOrder.nameZtoA:
          sortedNames = itemNames.slice().sort((a, b) => b.localeCompare(a));
          break;
      }

      itemsPage.verifySortedValues(itemNames, sortedNames);
    });
  }
});
