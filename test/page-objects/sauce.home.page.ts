import Page from "./page";
import chai from "chai";
import reporter from "../helper/reporter";

class HomePage extends Page {
  constructor() {
    super();
  }

  /** Page objects */
  get usernameInputBox() {
    return $(`#user-name`);
  }
  get passwordInputBox() {
    return $(`#password`);
  }
  get loginBtn() {
    return $(`#login-button`);
  }

  /** Page actions */
  async enterUsername(testId: string, username: string) {
    if (!username) throw Error(`Given username ${username} is not valid`);

    try {
      username = username.trim();
      await this.typeInto(await this.usernameInputBox, username);
      reporter.addStep(
        testId,
        "info",
        `Username: ${username} entered successfully`
      );
    } catch (err) {
      err.message = `Error entering username: ${username}, ${err.message}`;
      throw err;
    }
  }

  async enterPassword(testId: string, password: string) {
    if (!password) throw Error(`Given password ${password} is not valid`);

    try {
      password = password.trim();
      await this.typeInto(await this.passwordInputBox, password);
      reporter.addStep(testId, "info", `Password entered successfully`);
    } catch (err) {
      err.message = `Error entering password, ${err.message}`;
      throw err;
    }
  }

  async clickLoginBtn(testId: string) {
    try {
      await this.click(await this.loginBtn);
      reporter.addStep(testId, "info", `Login button clicked`);
    } catch (err) {
      err.message = `Error clicking login button, ${err.message}`;
      throw err;
    }
  }

  async loginToSauceApp(testId: string, username: string, password: string) {
    try {
      await this.enterUsername(testId, username);
      await this.enterPassword(testId, password);
      await this.clickLoginBtn(testId);
    } catch (err) {
      throw err;
    }
  }
}

export default new HomePage();
