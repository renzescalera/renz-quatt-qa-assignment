# **renz_quatt_qa_assignment**

- This is to represent Renz Escalera's API test automation skills for his QA Engineer job application in Quatt. Morever, this is a jest and supertest framework.

  ## **Folder Structure and Important files**

  ### pages

  - Contains the Page Object Model (POM) file UserEndpoint.js.
  - This file includes:
    - Reusable functions and methods for interacting with the /public/v2/users endpoint and validation of the response.
    - Static data used in the API test automation.
    - The POM enhances readability, reusability, and maintainability of the test code.

  ### test

  - This folder contains all the test spec files such as the CRUD test operations for /public/v2/users endpoint.

  ## **How to run the test**

  ### Step 1: Download the repository to your local machine

  - Click on the Code button (green button) and copy the url.
  - And then, you go to your local file explorer.
  - Right click and select "Open Git Bash here".
  - Type git clone and paste the copied url and hit enter

  ### Step 2: Install dependencies/package manager - NPM

  - Open the repository directory in terminal.
  - Enter the command in the terminal. For example, "cd C:\users\<your computer>\renz-quatt-qa-assignment"
  - Once you are already in the correct directory.
  - Enter the command in the terminal: "npm install".
  - To verify installation, enter this command: "npm list".

  ### Step 3: Setup your local env variables - .env.local file

  - In the root directory of the repository add .env.local
  - You may check the .env.example for how your .env.local should look like
  - Define the environment variable
  - BASE_URL: https://gorest.co.in
  - For AUTH_TOKEN, follow the steps below:

  1. Visit this url: https://gorest.co.in/consumer/login
  2. Login using your Github/Google/Microsoft account
  3. Once logged in, copy the token
  4. Paste it into your AUTH_TOKEN in your .env.local

  ### Step 4: Running the tests

  - In your terminal you can use the command: "npm test" to run the entire test suite
  - If you want to run a specific test spec file, you may use the command: "npm test get-user.test.js" or "npm test put-user.test.js"
