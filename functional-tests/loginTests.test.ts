import { readFromCsv } from "../helpers/readFromCsv";
import { baseItemsTest } from "../fixtures/loginFixture";

baseItemsTest.beforeEach(async ({ loginPage }) => {
  await loginPage.navigateToUrl(loginPage.url);
});

baseItemsTest.describe.parallel(
  "Verify logins for different user types",
  () => {
    const records = readFromCsv("testData", "Accounts.csv");

    for (const record of records) {
      baseItemsTest(
        `Verify login for ${record.test_case}`,
        async ({ loginPage, itemsPage }) => {
          await loginPage.userLogin(record.login, record.password);
          await itemsPage.getSidebar.openSidebar();

          await itemsPage.getSidebar.isAllItemsLinkVisible();
          await itemsPage.getSidebar.isAboutLinkVisible();
          await itemsPage.getSidebar.isLogoutLinkVisible();
          await itemsPage.getSidebar.isResetAppStateLinkVisible();
        }
      );
    }
  }
);

baseItemsTest("Verify user log out", async ({ loginPage, itemsPage }) => {
  await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.getSidebar.openSidebar();
  loginPage = await itemsPage.getSidebar.logOut();

  await loginPage.isLoginButtonVisible();
});

baseItemsTest.describe.parallel(
  "Verify unavailability to login with invalid credentials",
  () => {
    const invalidCredentials = [
      {
        testName: "empty login",
        login: "",
        password: "secret_sauce",
        errorMessage: "Username is required",
      },
      {
        testName: "empty password",
        login: "standard_user",
        password: "",
        errorMessage: "Password is required",
      },
      {
        testName: "invalid login",
        login: "standard_login",
        password: "secret_sauce",
        errorMessage:
          "Username and password do not match any user in this service",
      },
      {
        testName: "invalid password",
        login: "standard_user",
        password: "secret_sa",
        errorMessage:
          "Username and password do not match any user in this service",
      },
      {
        testName: "locked out user",
        login: "locked_out_user",
        password: "secret_sauce",
        errorMessage: "Sorry, this user has been locked out.",
      },
    ];
    for (const credential of invalidCredentials) {
      baseItemsTest(
        `Verify login for user with ${credential.testName}`,
        async ({ loginPage }) => {
          await loginPage.userLogin(credential.login, credential.password);

          await loginPage.verifyErrorText(
            `Epic sadface: ${credential.errorMessage}`
          );
          await loginPage.isLoginButtonVisible();
        }
      );
    }
  }
);
