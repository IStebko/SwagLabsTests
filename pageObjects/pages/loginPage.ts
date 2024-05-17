import fs from "fs";
import path from "path";
import { expect, Locator, Page } from "@playwright/test";
import { readFromCsv } from "../../helpers/readFromCsv";
import { AbstractPage } from "./abstractPages/abstractPage";
export class LoginPage extends AbstractPage {
  private readonly config: any;
  public readonly url: string;
  public readonly login: string;
  public readonly password: string;

  private readonly loginTextBox: Locator;
  private readonly passwordTextBox: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.config = JSON.parse(
      fs.readFileSync(path.resolve("testConfig.json"), "utf8")
    );
    this.url = this.config.homePageUrl;

    this.loginTextBox = page.locator("id=user-name");
    this.passwordTextBox = page.locator("id=password");
    this.loginButton = page.locator("id=login-button");
  }

  public async userLogin(login: string, password: string) {
    await this.loginTextBox.fill(login);
    await this.passwordTextBox.fill(password);
    await this.loginButton.click();
  }

  public async logInAsSpecificUser(userName: string) {
    const records = readFromCsv("testData", "Accounts.csv").filter((record) =>
      record.test_case.includes(userName)
    );
    return this.userLogin(records[0].login, records[0].password);
  }

  public async isLoginButtonVisible() {
    return await expect(
      this.loginButton,
      "Login link is not visible"
    ).toBeVisible();
  }
}
