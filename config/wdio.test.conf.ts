import { config as baseConfig } from "../wdio.conf";

export const config = Object.assign(baseConfig, {
  // All test env specific key val pairs
  environment: "TEST",
  sauceDemoURL: "https://www.saucedemo.com",
  reqresBaseURL: "https://reqres.in",
  nopCommerceBASEUEL: "https://admin-demo.nopcommerce.com",
});
