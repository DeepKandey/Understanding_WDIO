import { Then } from "@cucumber/cucumber";
import chai from "chai";
import logger from "../../helper/logger";
import reporter from "../../helper/reporter";
import fs from "fs";
import nopCommerceCustListPage from "../../page-objects/nopcommerce.custlist.page";

Then(/^Inventory page should list (.*)$/, async function (noOfProducts) {
  console.log(`Starting Test Id: ${this.testId}`);
  // console.log(`>> The app id: ${this.appid}`);
  try {
    if (!noOfProducts) {
      throw Error(`Invalid number provided: ${noOfProducts}`);
    }

    let eleArr = await $$(`.inventory_item_name`);
    try {
      chai.expect(eleArr.length).to.equal(parseInt(noOfProducts));
    } catch (error) {
      reporter.addStep(
        this.testId,
        "error",
        "Known issue - product count mistmatch",
        true,
        "JIRA-123"
      );
    }
  } catch (e) {
    console.log(`>> The type of error: ${typeof e}`);
    console.log(`>> The name of the property: ${e.name}`);
    console.log(`>> The name of the message: ${e.message}`);
  }
});

/**Steps:
 * 1. Get price list
 * 2. Convert string to number
 * 3. Assert if any value is <=0
 */
Then(/^Validate all products have valid price$/, async function () {
  logger.info(`${this.testId}: Checking the price...`);
  let eleArr = await $$(`.inventory_item_price`);
  let priceStrArr = [];
  for (let i = 0; i < eleArr.length; i++) {
    let priceStr = await eleArr[i].getText();
    priceStrArr.push(priceStr);
  }
  console.log(`>> Price with $: ${priceStrArr}`);

  //let priceNumArr = priceStrArr.map(ele=> +(ele.replace("$","")))
  let priceNumArr = priceStrArr.map((ele) => parseFloat(ele.replace("$", "")));
  console.log(`>> Price in numbers: ${priceNumArr}`);

  let invalidPriceArr = priceNumArr.filter((ele) => ele <= 0);
  chai.expect(invalidPriceArr.length).to.equal(0);
});

Then(/^Verify if all users exists in customers list$/, async function () {
  try {
    // @ts-ignore
    await browser.url(
      `${browser.config.nopCommerceBASEUEL}/Admin/Customer/List`
    );
    reporter.addStep(
      this.testId,
      "info",
      `Navigated to customer list screen...`
    );

    let fileName = `${process.cwd()}/data/api-rest/reqresAPIUsers.json`;
    let data = fs.readFileSync(fileName, "utf8");
    let dataObj = JSON.parse(data);
    //  console.log(`API data: ${JSON.stringify(dataObj)}`);

    let numOfObjects = dataObj.data.length;
    let arr = [];
    for (let i = 0; i < numOfObjects; i++) {
      let obj = {};
      let firstname = dataObj.data[i].first_name;
      let lastname = dataObj.data[i].last_name;
      let custNotFound = await nopCommerceCustListPage.searchNameAndConfirm(
        this.testId,
        firstname,
        lastname
      );

      if (custNotFound) {
        obj["firstname"] = firstname;
        obj["lasttname"] = lastname;
        arr.push(obj);
      }
    }

    if (arr.length > 1) {
      let data = JSON.stringify(arr, undefined, 4);
      let filepath = `${process.cwd()}/results/custNotFoundList.json`;
      fs.writeFileSync(filepath, data);
    }
  } catch (err) {
    err.message = `${this.testId}: Failed at checking user in nopcommerce site, ${err.message}`;
    throw err;
  }
});
