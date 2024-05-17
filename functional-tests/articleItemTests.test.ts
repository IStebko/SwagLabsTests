import { itemsOperationsTest } from "../fixtures/itemsOperationsFixture";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;
const addedItemsCount = 1;
const noItemsCount = 0;

itemsOperationsTest.beforeEach(async ({ loginPage }) => {
  await loginPage.navigateToUrl(loginPage.url);
  await loginPage.logInAsSpecificUser("standard user");
});

itemsOperationsTest(
  "Verify adding item to cart from Articles page",
  async ({ itemsPage, cartPage }) => {
    await itemsPage.addArticlesToCart([itemOrder]);
    const article = await itemsPage.getArticle(itemOrder);
    const articleTitle = await article.getTitle();
    await itemsPage.goToCart();
    const cartArticle = await cartPage.getCartItem(itemOrder);

    await cartPage.verifyItemsCount(addedItemsCount);
    await cartPage.verifyCartBadgeCount(addedItemsCount);
    await cartArticle.verifyArticleTitle(articleTitle);
  }
);

itemsOperationsTest(
  "Verify adding item to cart from Detailed Item Page",
  async ({ itemsPage, separateItemPage }) => {
    const article = await itemsPage.getArticle(itemOrder);
    const articleTitle = await article.getTitle();
    separateItemPage = await article.openDetailedItemPage();
    const separateItemTitle = await separateItemPage.getTitle();
    await separateItemPage.addItemToCart();

    await separateItemPage.verifyTextsAreEqual(articleTitle, separateItemTitle);
    await separateItemPage.verifyCartBadgeCount(addedItemsCount);
  }
);

itemsOperationsTest(
  "Verify removing item from cart from the Articles page",
  async ({ itemsPage, cartPage }) => {
    await itemsPage.addArticlesToCart([itemOrder]);
    await itemsPage.removeItemsFromCart([itemOrder]);
    await itemsPage.goToCart();

    await cartPage.verifyItemsCount(noItemsCount);
    await cartPage.verifyCartBadgeCount(noItemsCount);
  }
);

itemsOperationsTest(
  "Verify removing item from cart from the Cart page",
  async ({ itemsPage, cartPage }) => {
    await itemsPage.addArticlesToCart([itemOrder]);
    await itemsPage.goToCart();
    const cartArticle = await cartPage.getCartItem(itemOrder);
    await cartArticle.removeItem();

    await cartPage.verifyItemsCount(noItemsCount);
    await cartPage.verifyCartBadgeCount(noItemsCount);
  }
);

itemsOperationsTest(
  "Verify continue shopping from the Cart page",
  async ({ itemsPage, cartPage }) => {
    await itemsPage.goToCart();
    await cartPage.clickContinueShopping();

    await itemsPage.verifyTitle("Products");
  }
);

itemsOperationsTest(
  "Verify navigating to Checkout Information page from the Cart page",
  async ({ itemsPage, cartPage, checkOutInformationPage }) => {
    await itemsPage.goToCart();
    await cartPage.clickCheckoutButton();

    await checkOutInformationPage.verifyTitle("Checkout: Your Information");
  }
);
