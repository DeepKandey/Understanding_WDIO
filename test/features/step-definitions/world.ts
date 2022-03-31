import { setWorldConstructor } from "@wdio/cucumber-framework";
import chai from "chai";

class CustomWorld {
  testId: string;
  appid: string;
  constructor() {
    this.appid = "";
    this.testId = "";
  }
}
setWorldConstructor(CustomWorld);
