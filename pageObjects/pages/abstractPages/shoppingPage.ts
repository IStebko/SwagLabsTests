import { expect, Locator, Page } from "@playwright/test";
import { SidebarElement } from "../../elements/sidebar";
import { AbstractPage } from "./abstractPage";

export abstract class ShoppingPage extends AbstractPage {
  private readonly sidebar: SidebarElement;
  get getSidebar(): SidebarElement {
    return this.sidebar;
  }
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarElement(page);

    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  public async verifyCartBadgeCount(expectedItemsCount: number) {
    if (expectedItemsCount === 0) {
      await expect(
        this.cartBadge,
        "Cart badge is displayed but should not be"
      ).toBeHidden();
    } else {
      const itemsCount = parseInt(await this.cartBadge.innerText(), 10);
      expect(
        itemsCount,
        `Should be ${expectedItemsCount} on the badge, but there is ${itemsCount}`
      ).toEqual(expectedItemsCount);
    }
  }
}
