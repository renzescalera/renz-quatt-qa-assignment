require("dotenv").config({ path: ".env.local" });
const { faker } = require("@faker-js/faker");

const UserEndpoint = require("../pages/UserEndpoint");
const userEndpoint = new UserEndpoint();

describe("CRUD User hybrid API tests", () => {
  it("validate user endpoint CRUD operations by creating, updating, retrieving, and deleting a user", async () => {
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
        expect(response.body.id).toBe(userId);

        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newUserDetails
        );

        userEndpoint.validateDataChanges(response.body, newlyCreatedUser);
      });

    await userEndpoint
      .retrieveUsers(userEndpoint.token, userId)
      .then((response) => {
        userEndpoint.validateResponseStatus(response.status, 200);

        expect(response.body.id).toBe(userId);

        userEndpoint.validateResponseBodyOfSuccessfulCall(
          response.body,
          newUserDetails
        );
      });

    await userEndpoint
      .deleteExistingUser(userEndpoint.token, userId)
      .then((response) => {
        userEndpoint.validateResponseStatus(response.status, 204);
      });
  });
});
