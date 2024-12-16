require("dotenv").config({ path: ".env.local" });

const UserEndpoint = require("../pages/UserEndpoint");
const userEndpoint = new UserEndpoint();

let userId;

describe("DELETE User API tests", () => {
  beforeEach(async () => {
    await userEndpoint
      .createNewUser(userEndpoint.token, userEndpoint.newUser("male", "active"))
      .then((response) => {
        userId = response.body.id;

        userEndpoint.validateResponseStatus(response.status, 201);
      });
  });

  it("should delete an existing user", async () => {
    await userEndpoint
      .deleteExistingUser(userEndpoint.token, userId)
      .then((response) => {
        userEndpoint.validateResponseStatus(response.status, 204);
      });
  });

  it("should not delete a non-existent user", async () => {
    await userEndpoint
      .deleteExistingUser(userEndpoint.token, userEndpoint.invalidUserId)
      .then((response) => {
        userEndpoint.expectedResult.field = undefined;
        userEndpoint.expectedResult.message = "Resource not found";

        userEndpoint.validateResponseStatus(response.status, 404);
        userEndpoint.validateNegativeResponse(
          response.body,
          userEndpoint.expectedResult
        );
      });
  });

  it("should not delete a user that has been already deleted", async () => {
    await userEndpoint.deleteExistingUser(userEndpoint.token, userId);

    await userEndpoint
      .deleteExistingUser(userEndpoint.token, userId)
      .then((response) => {
        userEndpoint.expectedResult.field = undefined;
        userEndpoint.expectedResult.message = "Resource not found";

        userEndpoint.validateResponseStatus(response.status, 404);
        userEndpoint.validateNegativeResponse(
          response.body,
          userEndpoint.expectedResult
        );
      });
  });

  it("should not delete an existing user witn invalid token", async () => {
    await userEndpoint
      .deleteExistingUser(userEndpoint.invalidToken, userId)
      .then((response) => {
        userEndpoint.expectedResult.field = undefined;
        userEndpoint.expectedResult.message = "Invalid token";

        userEndpoint.validateResponseStatus(response.status, 401);
        userEndpoint.validateNegativeResponse(
          response.body,
          userEndpoint.expectedResult
        );
      });
  });

  it("should not delete an existing user witn missing token", async () => {
    await userEndpoint
      .deleteExistingUser(userEndpoint.missingToken, userId)
      .then((response) => {
        userEndpoint.expectedResult.field = undefined;
        userEndpoint.expectedResult.message = "Invalid token";

        userEndpoint.validateResponseStatus(response.status, 401);
        userEndpoint.validateNegativeResponse(
          response.body,
          userEndpoint.expectedResult
        );
      });
  });
});
