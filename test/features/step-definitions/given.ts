import { Given } from "@cucumber/cucumber";
import chai from "chai";

Given(/^Login to inventory web app$/, async function () {
  /**
   *  1. Launch browser
   */
  await browser.url("https://www.saucedemo.com/");
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();

  /**
   * 2. Login to inventory app
   */
  await $(`#user-name`).setValue("standard_user");
  await $(`#password`).setValue("secret_sauce");
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
});
