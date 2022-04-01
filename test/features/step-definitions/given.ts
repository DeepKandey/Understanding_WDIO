import { Given } from "@cucumber/cucumber";
import chai from "chai";
import logger from "../../helpers/logger";

Given(/^Login to inventory web app$/, async function (dataTable) {
  logger.info(`${this.testId}: Started to login with Sauce demo app`);
  console.log(`Test username: ${process.env.TEST_STD_USERNAME}`);
  // get the testId
  console.log(`Given step Test Id: ${this.testId}`);
  // Getting values from data table
  let dt = dataTable.hashes();
  console.log(`>> The type of dt: ${typeof dt}`);
  console.log(`>> The type of dt constructor: ${dt.constructor}`);
  console.log(`>> The value of dt: ${JSON.stringify(dt)}`);
  /**
   *  1. Launch browser
   */
  // @ts-ignore
  await browser.url(browser.config.sauceDemoURL);
  console.log(`>>Test config values: ${JSON.stringify(browser.config)}`);
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();

  /**
   * 2. Login to inventory app
   */
  await $(`#user-name`).setValue(dt[0].Username);
  //await $(`#user-name`).setValue(process.env.TEST_STD_USERNAME);
  await $(`#password`).setValue(process.env.TEST_STD_PASSWORD);
  await $(`#login-button`).click();

  /** Login with another user/session */
  await browser.pause(2000);
  await browser.reloadSession();
  await browser.url("https://www.saucedemo.com/");
  await $(`#user-name`).setValue("problem_user");
  await $(`#password`).setValue("secret_sauce");
  await $(`#login-button`).click();

  // await browser.back();
  // await browser.pause(2000);
  // await browser.forward();
  this.appid = "ABC123";
});
