const supertest = require("supertest");
const request = supertest(process.env.BASE_URL);
const { faker } = require("@faker-js/faker");

class UserEndpoint {
  constructor() {
    this.token = process.env.AUTH_TOKEN;
    this.invalidToken = "testinvalidtoken123";
    this.missingToken = null;
    this.invalidUserId = "123";

    this.newUser = (userGender, userStatus) => ({
      name: faker.company.name(),
      email: faker.internet.email(),
      gender: userGender,
      status: userStatus,
    });

    this.expectedResult = {
      field: null,
      message: null,
    };
  }

  apiRequest(method, endpoint, token, requestBody = null) {
    let requestBuilder = request[method](endpoint).set(
      "Authorization",
      `Bearer ${token}`
    );

    if (requestBody) {
      requestBuilder = requestBuilder.send(requestBody);
    }

    return requestBuilder;
  }

  retrieveUsers(token, userId = "") {
    return this.apiRequest("get", `/public/v2/users/${userId}`, token);
  }

  createNewUser(token, requestBody) {
    return this.apiRequest("post", "/public/v2/users", token, requestBody);
  }

  updateExistingUser(token, userId, requestBody) {
    return this.apiRequest(
      "put",
      `/public/v2/users/${userId}`,
      token,
      requestBody
    );
  }

  deleteExistingUser(token, userId = "") {
    return this.apiRequest("delete", `/public/v2/users/${userId}`, token);
  }

  validateResponseStatus(actualStatus, expectedStatus) {
    expect(actualStatus).toBe(expectedStatus);
  }

  validateResponseBodyOfSuccessfulCall(actualObject, expectedObject) {
    expect(actualObject.name).toBe(expectedObject.name);
    expect(actualObject.email).toBe(expectedObject.email);
    expect(actualObject.gender).toBe(expectedObject.gender);
    expect(actualObject.status).toBe(expectedObject.status);
  }

  validateNegativeResponse(actualObject, expectedObject) {
    expect(actualObject.field).toBe(expectedObject.field);
    expect(actualObject.message).toBe(expectedObject.message);
  }

  validateDataChanges(newDataObject, oldDataObject) {
    expect(newDataObject.name).not.toBe(oldDataObject.name);
    expect(newDataObject.email).not.toBe(oldDataObject.email);
    expect(newDataObject.gender).not.toBe(oldDataObject.gender);
    expect(newDataObject.status).not.toBe(oldDataObject.status);
  }
}

module.exports = UserEndpoint;
