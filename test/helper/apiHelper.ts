import request from "supertest";
import reporter from "../helper/reporter";

// what is request
console.log(`>> The typeof request: ${typeof request}`); // function
console.log(`>> Number of args: ${request.length}`);
console.log(`>> What is the definiton of the function: ${request.toString()}`);

async function GET(
  testId: string,
  baseUrl: string,
  endpoint: string,
  authToken: string,
  queryParams: object
) {
  if (!baseUrl || !endpoint) {
    throw Error(
      `>> Giveb baseUrl: ${baseUrl}, endpoint: ${endpoint} are not valid`
    );
  }
  baseUrl = baseUrl.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testId, "info", "Making a GET to ${endpoint}");
  try {
    return await request(baseUrl)
      .get(endpoint)
      .query(queryParams)
      .auth(authToken, { type: "bearer" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
  } catch (error) {
    error.message = `Error makig a GET call to ${endpoint}, ${error}`;
    throw error;
  }
}

async function POST(
  testId: string,
  baseUrl: string,
  endpoint: string,
  authToken: string,
  payload: object
) {
  if (!baseUrl || !endpoint) {
    throw Error(
      `>> Giveb baseUrl: ${baseUrl}, endpoint: ${endpoint} are not valid`
    );
  }
  baseUrl = baseUrl.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testId, "info", "Making a GET to ${endpoint}");
  try {
    return await request(baseUrl)
      .post(endpoint)
      .auth(authToken, { type: "bearer" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(payload);
  } catch (error) {
    error.message = `Error makig a POST call to ${endpoint}, ${error}`;
    throw error;
  }
}

export default { GET, POST };
/**"https://reqres.in/"
 * "api/users?page=2"
 */
