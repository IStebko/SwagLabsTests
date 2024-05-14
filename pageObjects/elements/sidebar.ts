import { expect, Locator } from "@playwright/test";
import { Page } from "playwright";
import { LoginPage } from "../pages/loginPage";

export class SidebarElement {
  private readonly page: Page;
  private readonly burgerIcon: Locator;
  private readonly closeButton: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerIcon = page.locator("id=react-burger-menu-btn");
    this.closeButton = page.locator("id=react-burger-cross-btn");
    this.allItemsLink = page.locator("id=inventory_sidebar_link");
    this.aboutLink = page.locator("id=about_sidebar_link");
    this.logoutLink = page.locator("id=logout_sidebar_link");
    this.resetAppStateLink = page.locator("id=reset_sidebar_link");
  }

  public async isAllItemsLinkVisible() {
    return await expect(
      this.allItemsLink,
      "All items link is not visible"
    ).toBeVisible();
  }

  public async isAboutLinkVisible() {
    return await expect(
      this.aboutLink,
      "About link is not visible"
    ).toBeVisible();
  }

  public async isLogoutLinkVisible() {
    return await expect(
      this.logoutLink,
      "Logout link is not visible"
    ).toBeVisible();
  }

  public async isResetAppStateLinkVisible() {
    return await expect(
      this.resetAppStateLink,
      "Reset app state link is not visible"
    ).toBeVisible();
  }

  public async openSidebar() {
    await this.burgerIcon.click();
  }

  public async closeSidebar() {
    await this.closeButton.click();
  }

  public async logOut() {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}
