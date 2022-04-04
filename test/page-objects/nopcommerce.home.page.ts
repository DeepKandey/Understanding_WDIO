import Page from "./page";
import chai from "chai";
import reporter from "../helper/reporter";

class HomePage extends Page {
  constructor() {
    super();
  }

  /** Page objects */
  get usernameInputBox() {
    return $(`#Email`);
  }
  get passwordInputBox() {
    return $(`#Password`);
  }
  get loginBtn() {
    return $(`button=Log in`);
  }

  /** Page actions */
  async loginTonopCommerceWeb(
    testId: string,
    url: string,
    username: string,
    password: string
  ) {
    if (!url || !username || !password) {
      throw Error(
        `Given data, url: ${url}, username: ${username} or password is not valid`
      );
    }
    url = url.trim();
    username = username.trim();
    try {
      reporter.addStep(testId, "info", `Login to :${url} with ${username}`);
      await this.navigateTo(url);
      await this.typeInto(await this.usernameInputBox, username);
      await this.typeInto(await this.passwordInputBox, password);
      await this.click(await this.loginBtn);
      reporter.addStep(
        testId,
        "info",
        `Login to :${url} with ${username} is successful`
      );
    } catch (err) {
      err.message = `Failed to login to nopcommerce web: ${url}, with username: ${username}`;
      throw err;
    }
  }
}

export default new HomePage();
