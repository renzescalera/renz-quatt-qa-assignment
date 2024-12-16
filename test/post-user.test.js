require("dotenv").config({ path: ".env.local" });

const UserEndpoint = require("../pages/UserEndpoint");
const userEndpoint = new UserEndpoint();

describe("POST User API tests", () => {
  it("should create new user with gender male and status inactive", async () => {
    let userId;
    const newlyCreatedUser = userEndpoint.newUser("male", "inactive");

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
      .then((response) => {
        userId = response.body.id;

        userEndpoint.validateResponseStatus(response.status, 201);
        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newlyCreatedUser
        );
      });
  });

  it("should create new user with gender female and status active", async () => {
    let userId;
    const newlyCreatedUser = userEndpoint.newUser("female", "active");

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
      .then((response) => {
        userId = response.body.id;

        userEndpoint.validateResponseStatus(response.status, 201);
        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newlyCreatedUser
        );
      });
  });

  it("should not create an existing user", async () => {
    const newlyCreatedUser = userEndpoint.newUser("female", "active");

    await userEndpoint.createNewUser(userEndpoint.token, newlyCreatedUser);

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
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

  it("should not create a new user with incorrect email format", async () => {
    let newlyCreatedUser = userEndpoint.newUser("male", "active");
    newlyCreatedUser.email = "test12312";

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
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

  it("should not create a new user with invalid gender input", async () => {
    const newlyCreatedUser = userEndpoint.newUser("test", "áctive");

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
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

  it("should not create a new user with invalid status input", async () => {
    const newlyCreatedUser = userEndpoint.newUser("female", "test");

    await userEndpoint
      .createNewUser(userEndpoint.token, newlyCreatedUser)
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

  it("should not create new user with invalid token", async () => {
    const newlyCreatedUser = userEndpoint.newUser("male", "active");

    await userEndpoint
      .createNewUser(userEndpoint.invalidToken, newlyCreatedUser)
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

  it("should not create new user with missing token", async () => {
    const newlyCreatedUser = userEndpoint.newUser("female", "inactive");

    await userEndpoint
      .createNewUser(userEndpoint.missingToken, newlyCreatedUser)
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
