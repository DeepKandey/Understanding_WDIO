import { Then } from "@cucumber/cucumber";
import chai from "chai";

Then(/^Inventory page should list (.*)$/, async function (noOfProducts) {
  console.log(`Starting Test Id: ${this.testId}`);
  console.log(`>> The app id: ${this.appid}`);
  if (!noOfProducts) {
    throw Error(`Invalid number provided: ${noOfProducts}`);
  }

  let eleArr = await $$(`.inventory_item_name`);
  chai.expect(eleArr.length).to.equal(parseInt(noOfProducts));
});

/**Steps:
 * 1. Get price list
 * 2. Convert string to number
 * 3. Assert if any value is <=0
 */
Then(/^Validate all products have valid price$/, async function () {
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
