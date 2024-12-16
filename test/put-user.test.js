require("dotenv").config({ path: ".env.local" });
const { faker } = require("@faker-js/faker");

const UserEndpoint = require("../pages/UserEndpoint");
const userEndpoint = new UserEndpoint();

let userId;
const newlyCreatedUser = userEndpoint.newUser("male", "inactive");

describe("PUT User API tests", () => {
  beforeAll(async () => {
    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
      .then((response) => {
        userId = response.body.id;

        userEndpoint.validateResponseStatus(response.status, 201);
      });
  });

  it("should update all user details", async () => {
    const newUserDetails = {
      name: faker.company.name(),
      email: faker.internet.email(),
      gender: "female",
      status: "active",
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, newUserDetails)
      .then((response) => {
        userEndpoint.validateResponseStatus(response.status, 200);

        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newUserDetails
        );

        userEndpoint.validateDataChanges(response.body, newlyCreatedUser);
      });
  });

  it("should not update email with non-existent user", async () => {
    const newUserEmail = {
      email: faker.internet.email(),
    };

    await userEndpoint
      .updateExistingUser(
        userEndpoint.token,
        userEndpoint.invalidUserId,
        newUserEmail
      )
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

  it("should not update user name with null", async () => {
    const newUserName = {
      name: null,
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, newUserName)
      .then((response) => {
        userEndpoint.expectedResult.field = "name";
        userEndpoint.expectedResult.message = "can't be blank";

        userEndpoint.validateResponseStatus(response.status, 422);
        userEndpoint.validateNegativeResponse(
          response.body[0],
          userEndpoint.expectedResult
        );
      });
  });

  it("should not update user email using an email that already exists", async () => {
    let existingUserEmail = {
      email: null,
    };

    await userEndpoint
      .createNewUser(
        userEndpoint.token,
        userEndpoint.newUser("male", "inactive")
      )
      .then((response) => {
        existingUserEmail.email = response.body.email;
      });

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, existingUserEmail)
      .then((response) => {
        userEndpoint.expectedResult.field = "email";
        userEndpoint.expectedResult.message = "has already been taken";

        userEndpoint.validateResponseStatus(response.status, 422);
        userEndpoint.validateNegativeResponse(
          response.body[0],
          userEndpoint.expectedResult
        );
      });
  });

  it("should not update user email with incorrect format", async () => {
    const newUserEmail = {
      email: "testtest123",
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, newUserEmail)
      .then((response) => {
        userEndpoint.expectedResult.field = "email";
        userEndpoint.expectedResult.message = "is invalid";

        userEndpoint.validateResponseStatus(response.status, 422);
        userEndpoint.validateNegativeResponse(
          response.body[0],
          userEndpoint.expectedResult
        );
      });
  });

  it("should not update user with incorrect gender type", async () => {
    const newUserGender = {
      gender: "test",
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, newUserGender)
      .then((response) => {
        userEndpoint.expectedResult.field = "gender";
        userEndpoint.expectedResult.message =
          "can't be blank, can be male of female";

        userEndpoint.validateResponseStatus(response.status, 422);
        userEndpoint.validateNegativeResponse(
          response.body[0],
          userEndpoint.expectedResult
        );
      });
  });

  it("should not update user with incorrect status type", async () => {
    const newUserStatus = {
      status: "test",
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.token, userId, newUserStatus)
      .then((response) => {
        userEndpoint.expectedResult.field = "status";
        userEndpoint.expectedResult.message = "can't be blank";

        userEndpoint.validateResponseStatus(response.status, 422);
        userEndpoint.validateNegativeResponse(
          response.body[0],
          userEndpoint.expectedResult
        );
      });
  });

  it("should not update new user with invalid token", async () => {
    const newUserStatus = {
      name: faker.company.name(),
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.invalidToken, userId, newUserStatus)
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

  it("should not update new user with missing token", async () => {
    const newUserStatus = {
      email: faker.internet.email(),
    };

    await userEndpoint
      .updateExistingUser(userEndpoint.missingToken, userId, newUserStatus)
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
