require("dotenv").config({ path: ".env.local" });

const UserEndpoint = require("../pages/UserEndpoint");
const userEndpoint = new UserEndpoint();

describe("GET User API tests", () => {
  it("should retrieve newly created user by user id", async () => {
    let userId;
    const newlyCreatedUser = userEndpoint.newUser("male", "active");

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
      .then((response) => {
        userId = response.body.id;

        expect(response.body.name).toBe(newlyCreatedUser.name);
      });

    await userEndpoint
      .retrieveUsers(userEndpoint.token, userId)
      .then((response) => {
        userEndpoint.validateResponseStatus(response.status, 200);
        expect(response.body.id).toBe(userId);

        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newlyCreatedUser
        );
      });
  });

  it("should retrieve all users", async () => {
    await userEndpoint.retrieveUsers(userEndpoint.token).then((response) => {
      userEndpoint.validateResponseStatus(response.status, 200);
      expect(response.body.length >= 0).toBe(true);

      response.body.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("gender");
        expect(user).toHaveProperty("status");
      });
    });
  });

  it("should not retrieve a non-existent user", async () => {
    await userEndpoint
      .retrieveUsers(userEndpoint.token, userEndpoint.invalidUserId)
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

  it("should not retrieve data with invalid token", async () => {
    await userEndpoint
      .retrieveUsers(userEndpoint.invalidToken)
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

  it("should not retrieve data with missing token", async () => {
    await userEndpoint
      .retrieveUsers(userEndpoint.missingToken)
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
