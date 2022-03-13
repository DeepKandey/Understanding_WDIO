import { Given, When, Then } from "@wdio/cucumber-framework";
import chai from "chai";

Given(/^Google page is opened$/, async function () {
  console.log("Before opening browser....");
  await browser.url("https://www.google.com");
  // browser.debug();
  await browser.pause(7000);
  console.log("After opening browser....");
});

When(/^Search with (.*)$/, async function (searchItem) {
  console.log(`>> searchItem: ${searchItem}`);
  let ele = await $(`[name=q]`);
  // await ele.click();
  await ele.setValue(searchItem);
  await browser.keys("Enter");
});

Then(/^Click on first search result$/, async function () {
  let ele = await $(`<h3>`);
  ele.click();
});

Then(/^URL should match (.*)$/, async function (expectedURL) {
  console.log(`>> expectedURL: ${expectedURL}`);
  let url = await browser.getUrl();
  chai.expect(url).to.equal(expectedURL);
});

/**Web Interactions */

Given(/^A web page is opened$/, async function () {
  await browser.url("/inputs");
  await browser.setTimeout({ implicit: 10000, pageLoad: 10000 });
  await browser.maximizeWindow();
});

Then(/^Perform web interactions$/, async function () {
  let num = 12345;
  let strNum = num.toString();

  let ele = await $(`[type=number]`);
  //  await ele.click();
  //  await ele.moveToElement();
  //await ele.scrollIntoView();

  await ele.setValue("12345"); // clear before entering
  // await ele.addValue("WDIO");  // append

  // ele.click();
  // enter slowly each character of the string
  for (let index = 0; index < strNum.length; index++) {
    let charStr = strNum.charAt(index);
    await browser.pause(1000);
    await browser.keys(charStr);
  }

  await browser.pause(3000);
});
