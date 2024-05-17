import { baseItemsTest } from "../fixtures/loginFixture";

enum SortOrder {
  nameAtoZ = "az",
  nameZtoA = "za",
  priceLowToHigh = "lohi",
  priceHighToLow = "hilo",
}

baseItemsTest.beforeEach(async ({ loginPage }) => {
  await loginPage.navigateToUrl(loginPage.url);
  await loginPage.logInAsSpecificUser("standard user");
});

baseItemsTest.describe.parallel("Price sorting drop-down verification", () => {
  const testCases = [
    { sortingOption: SortOrder.priceLowToHigh },
    { sortingOption: SortOrder.priceHighToLow },
  ];

  for (const testCase of testCases) {
    baseItemsTest(
      `Verify sorting by item price ${testCase.sortingOption}`,
      async ({ itemsPage }) => {
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
      }
    );
  }
});

baseItemsTest.describe.parallel("Name sorting drop-down verification", () => {
  const testCases = [
    { sortingOption: SortOrder.nameAtoZ },
    { sortingOption: SortOrder.nameZtoA },
  ];

  for (const testCase of testCases) {
    baseItemsTest(
      `Verify sorting by item name ${testCase.sortingOption}`,
      async ({ itemsPage }) => {
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
      }
    );
  }
});
