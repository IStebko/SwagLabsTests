import { itemsOperationsTest } from "../fixtures/itemsOperationsFixture";
import { readFromCsv } from "../helpers/readFromCsv";

const items = readFromCsv("testData", "Products.csv");
const itemOrder = items[0].test_case;

itemsOperationsTest.beforeEach(async ({ loginPage, itemsPage, cartPage }) => {
  await loginPage.navigateToUrl(loginPage.url);
  await loginPage.logInAsSpecificUser("standard user");
  await itemsPage.addArticlesToCart([itemOrder]);
  await itemsPage.goToCart();
  await cartPage.clickCheckoutButton();
});

itemsOperationsTest(
  "Verify proceeding from Checkout Information Page to Checkout Overview Page",
  async ({ checkOutInformationPage, checkOutOverviewPage }) => {
    await checkOutInformationPage.validCheckout("John", "Doe", "12345");

    await checkOutOverviewPage.verifyTitle("Checkout: Overview");
  }
);

itemsOperationsTest(
  "Verify order cancel from the Checkout Information Page",
  async ({ cartPage, checkOutInformationPage }) => {
    await checkOutInformationPage.clickCancelButton();
    await cartPage.verifyTitle("Your Cart");

    await cartPage.verifyCartBadgeCount(1);
  }
);

itemsOperationsTest.describe.parallel(
  "Verify unavailability to checkout with invalid data entered",
  () => {
    const invalidCredentials = [
      {
        testName: "empty Zip Code",
        firstName: "John",
        lastName: "Doe",
        zipCode: "",
        errorMessage: "Postal Code",
      },
      {
        testName: "empty Last Name",
        firstName: "John",
        lastName: "",
        zipCode: "12345",
        errorMessage: "Last Name",
      },
      {
        testName: "empty First Name",
        firstName: "",
        lastName: "Doe",
        zipCode: "12345",
        errorMessage: "First Name",
      },
    ];
    for (const credential of invalidCredentials) {
      itemsOperationsTest(
        `Verify checkout for user with ${credential.testName}`,
        async ({ checkOutInformationPage }) => {
          await checkOutInformationPage.validCheckout(
            credential.firstName,
            credential.lastName,
            credential.zipCode
          );

          await checkOutInformationPage.verifyErrorText(
            `Error: ${credential.errorMessage} is required`
          );
        }
      );
    }
  }
);
