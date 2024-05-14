import { test } from "@playwright/test";
import { ItemsPage } from "../pageObjects/pages/itemsPage";
import { LoginPage } from "../pageObjects/pages/loginPage";
import { CartPage } from "../pageObjects/pages/cartPage";
import { SeparateItemPage } from "../pageObjects/pages/separateItemPage";
import { readFromCsv } from "../helpers/readFromCsv";

let loginPage: LoginPage;
let itemsPage: ItemsPage;
let cartPage: CartPage;
let separateItemPage: SeparateItemPage;

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;
const addedItemsCount = 1;
const noItemsCount = 0;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await page.goto(loginPage.url);
  itemsPage = await new LoginPage(page).logInAsSpecificUser("standard user");
});

test("Verify adding item to cart from Articles page", async () => {
  await itemsPage.addArticlesToCart([itemOrder]);
  const article = await itemsPage.getArticle(itemOrder);
  const articleTitle = await article.getTitle();
  cartPage = await itemsPage.goToCart();
  const cartArticle = await cartPage.getCartItem(itemOrder);

  await cartPage.verifyItemsCount(addedItemsCount);
  await cartPage.verifyCartBadgeCount(addedItemsCount);
  await cartArticle.verifyArticleTitle(articleTitle);
});

test("Verify adding item to cart from Detailed Item Page", async () => {
  const article = await itemsPage.getArticle(itemOrder);
  const articleTitle = await article.getTitle();
  separateItemPage = await article.openDetailedItemPage();
  const separateItemTitle = await separateItemPage.getTitle();
  await separateItemPage.addItemToCart();

  await separateItemPage.verifyTextsAreEqual(articleTitle, separateItemTitle);
  await separateItemPage.verifyCartBadgeCount(addedItemsCount);
});

test("Verify removing item from cart from the Articles page", async () => {
  await itemsPage.addArticlesToCart([itemOrder]);
  await itemsPage.removeItemsFromCart([itemOrder]);
  cartPage = await itemsPage.goToCart();

  await cartPage.verifyItemsCount(noItemsCount);
  await cartPage.verifyCartBadgeCount(noItemsCount);
});

test("Verify removing item from cart from the Cart page", async () => {
  await itemsPage.addArticlesToCart([itemOrder]);
  cartPage = await itemsPage.goToCart();
  const cartArticle = await cartPage.getCartItem(itemOrder);
  await cartArticle.removeItem();

  await cartPage.verifyItemsCount(noItemsCount);
  await cartPage.verifyCartBadgeCount(noItemsCount);
});

test("Verify continue shopping from the Cart page", async () => {
  cartPage = await itemsPage.goToCart();
  await cartPage.clickContinueShopping();

  await itemsPage.verifyTitle("Products");
});

test("Verify navigating to Checkout Information page from the Cart page", async () => {
  cartPage = await itemsPage.goToCart();
  let checkOutInformationPage = await cartPage.clickCheckoutButton();

  await checkOutInformationPage.verifyTitle("Checkout: Your Information");
});
