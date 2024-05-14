import { expect, Locator, Page } from "@playwright/test";
import { ShoppingPage } from "./abstractPages/shoppingPage";
import { ArticleItem } from "../elements/articleItem";
import { CartPage } from "./cartPage";

export enum SortOrder {
  nameAtoZ = "az",
  nameZtoA = "za",
  priceLowToHigh = "lohi",
  priceHighToLow = "hilo",
}
export class ItemsPage extends ShoppingPage {
  private readonly cartLink: Locator;
  private readonly dropDownElement: Locator;
  private readonly inventoryItemPrices: Locator;
  get getInventoryItemPrices() {
    return this.inventoryItemPrices;
  }
  private readonly inventoryItemNames: Locator;
  get getInventoryItemNames() {
    return this.inventoryItemNames;
  }

  constructor(page: Page) {
    super(page);

    this.cartLink = page.locator(".shopping_cart_link");
    this.dropDownElement = page.locator(".product_sort_container");
    this.inventoryItemPrices = page.locator(".inventory_item_price");
    this.inventoryItemNames = page.locator(".inventory_item_name ");
  }

  public async selectValueInDropDown(value: SortOrder) {
    await this.dropDownElement.selectOption({ value: value });
  }

  public async addArticlesToCart(itemOrders: number[]) {
    for (const itemOrder of itemOrders) {
      const articleItem = await this.getArticle(itemOrder);
      await articleItem.addItem();
    }
  }

  public async removeItemsFromCart(itemOrders: number[]) {
    for (const itemOrder of itemOrders) {
      const articleItem = await this.getArticle(itemOrder);
      await articleItem.removeItem();
    }
  }

  public async getArticle(itemOrder: number) {
    return new ArticleItem(this.page, itemOrder);
  }

  public async goToCart() {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  public async verifySortedValues(
    expectedPrices: Array<number> | Array<string>,
    actualPrices: Array<number> | Array<string>
  ) {
    expect(actualPrices).toEqual(expectedPrices);
  }
}
