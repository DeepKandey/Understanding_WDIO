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
  await browser.waitUntil(
    async function () {
      return (
        (await browser.getTitle()) ===
        "WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO"
      );
    },
    {
      timeout: 20000,
      interval: 500,
      timeoutMsg: `Failed loading WDIO title: ${expectedURL}`,
    }
  );
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
  //  await ele.scrollIntoView();

  await ele.setValue("12345"); // clear before entering
  // await ele.addValue("WDIO");  // append

  // enter slowly each character of the string
  // for (let index = 0; index < strNum.length; index++) {
  //   let charStr = strNum.charAt(index);
  //   await browser.pause(1000);
  //   await browser.keys(charStr);
  // }

  //await browser.pause(3000);

  /**
   * 2. Dropdown
   * Actions
   * 1. Assert deafult option is selected
   * 2. Select by attribute, text, index
   * 3. Get a list of options
   */

  await browser.url("/dropdown");

  let selectedElement = await $(`select [selected=selected]`);
  let value = await selectedElement.getText();
  chai.expect(value).to.equal("Please select an option");

  // await browser.debug();

  // select a particular option
  // let ddElement = $(`#dropdown`);
  // await ddElement.selectByVisibleText("Option 2");
  // await ddElement.selectByAttribute("value", "2");
  // await ddElement.selectByIndex(1);

  let arr = [];
  let selectOptions = await $$(`select#dropdown > option`);
  for (let index = 0; index < selectOptions.length; index++) {
    let ele = selectOptions[index];
    arr.push(await ele.getText());
  }

  console.log(`>> Options Array: ${arr}`);

  // check boxes handling
  await browser.url("/checkboxes");

  let checkBoxkArray = await $$(`form#checkboxes input`);
  for (let i = 0; i < checkBoxkArray.length; i++) {
    let element = checkBoxkArray[i];
    if (!(await element.isSelected())) {
      await element.click();
    }
  }

  // Window handling
  await browser.url("/windows");

  await $(`=Click Here`).click();
  await $(`=Elemental Selenium`).click();
  let currentWinTitle = await browser.getTitle();
  let parentWindowHandle = await browser.getWindowHandle();
  console.log(`>> currentWinTitle: ${currentWinTitle}`);

  // switch to specific window
  let winHandles = await browser.getWindowHandles();
  for (let i = 0; i < winHandles.length; i++) {
    console.log(`>> Win handle: ${winHandles[i]}`);
    await browser.switchToWindow(winHandles[i]);
    currentWinTitle = await browser.getTitle();
    if (
      currentWinTitle ===
      "Elemental Selenium: Receive a Free, Weekly Tip on Using Selenium like a Pro"
    ) {
      await browser.switchToWindow(winHandles[i]);
      let headerTxtEleSel = await $(`<h1>`).getText();
      console.log(`>> headerTxtEleSel:  ${headerTxtEleSel}`);
      //
      break;
    }
  }

  // switch back to parent windows
  browser.switchToWindow(parentWindowHandle);
  let parentWinHeaderTxt = await $(`<h3>`).getText();
  console.log(`>> parentWinHeaderTxt : ${parentWinHeaderTxt}`);

  // Alert Handling
  await browser.url("/javascript_alerts");

  await (await $(`button=Click for JS Alert`)).click();
  if (await browser.isAlertOpen()) {
    await browser.acceptAlert();
  }

  await (await $(`button=Click for JS Confirm`)).click();
  if (await browser.isAlertOpen()) {
    await browser.dismissAlert();
  }

  await (await $(`button=Click for JS Prompt`)).click();
  if (await browser.isAlertOpen()) {
    let alertText = await browser.getAlertText();
    console.log(`>> alertText: ${alertText}`);
    await browser.sendAlertText("Hello JS Prompt");
    await browser.acceptAlert();
  }

  // File Upload
  await browser.url("upload");
  await $(`#file-upload`).addValue(
    `${process.cwd()}/data/fileUpload/dummy.txt`
  );
  await $(`#file-submit`).click();

  // Handling frames
  await browser.url("/frames");

  await $(`=iFrame`).click();
  let ele_frame = await $(`#mce_0_ifr`);
  await browser.switchToFrame(ele_frame);
  // Interaction with frames...
  await $(`#tinymce`).click();
  await browser.keys(["Meta", "A"]);
  await browser.pause(2000);
  await browser.keys("Delete");
  //await $(`#tinymce`).setValue(`Typing into a frame`);
  await $(`#tinymce`).addValue(`Typing into a frame`);
  await browser.switchToParentFrame();

  // scrolling
  await browser.url("https://www.amazon.com.au/");
  await $(`div#navFooter`).scrollIntoView();

  // handling web tables
  await browser.url("https://the-internet.herokuapp.com/tables");

  let rowCount = await $$(`//table[@id="table1"]/tbody/tr`).length;
  console.log(`>> Number of rows: ${rowCount}`);
  chai.expect(rowCount).to.equal(4);

  let columnCount = await $$(`//table[@id="table1"]/thead/tr/th`).length;
  console.log(`>> Number of columns: ${columnCount}`);
  chai.expect(columnCount).to.equal(6);

  let personObjArr = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    let personObj = {
      lastName: "",
      firstName: "",
      email: "",
      due: "",
      website: "",
      action: "",
    };

    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      let cellValue = await $(
        `//table[@id="table1"]/tbody/tr[${rowIndex + 1}]/td[${colIndex + 1}]`
      ).getText();
      // console.log(`>> Cell Value: ${cellValue}`);
      if (colIndex === 0) personObj.lastName = cellValue;
      if (colIndex === 1) personObj.firstName = cellValue;
      if (colIndex === 2) personObj.email = cellValue;
      if (colIndex === 3) personObj.due = cellValue;
      if (colIndex === 4) personObj.website = cellValue;
      if (colIndex === 5) personObj.action = cellValue;
    }
    personObjArr.push(personObj);
  }
  console.table(`Whole table: ${JSON.stringify(personObjArr)}`);

  // scrolling up
  await browser.url("https://www.amazon.com.au/");
  await browser.execute(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await browser.execute(() => {
    window.scrollBy(0, -window.innerHeight);
  });

  // scrollTo
  await browser.execute(() => {
    window.scrollBy(0, document.body.scrollHeight);
  });

  // scroll up
  await browser.execute(() => {
    window.scrollBy(0, document.body.scrollTop);
  });

  //await browser.debug();
});
