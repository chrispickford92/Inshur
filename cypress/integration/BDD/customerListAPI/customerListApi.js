import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { expect } from "chai";

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

//In the current tests this variable will be used across all as the tests are running asynchronously
//If parrelisation is enabled, this solution might not be viable.
let apiEndpoint;

//Scenario: Verify accessibility of the API
Given("the API is accessible", (api) => {
  // Verify the environment is in a ready state
  // There may be a login process in this step if required in future.
  cy.request('/').as("pingAPI")
  cy.get("@pingAPI").its("status").should("eq", 200);
});

When("the User makes a GET request to the {string} API", (customerList) => {
  // Make a GET request to the specified API endpoint
  cy.request({
    method: "GET",
    url: customerList,
  }).as("apiResponse");
});

Then("the response should have a status code of {int}", (statusCode) => {
  // Validate the response status code
  cy.get("@apiResponse").its("status").should("eq", statusCode);
});

//Scenario: Verify customer list API response
Given("the customer list API is accessible at {string}", (api) => {
    // Verify the environment is in a ready state
  // There may be a login process in this step if required in future.
  cy.request(api).as("pingCustomerAPI")
  cy.get("@pingCustomerAPI").its("status").should("eq", 200);
  apiEndpoint = api; 
});

let responseBody; // Variable to store the response body the GET api call.
let expectedCustomers; // Variable to store the fixture values below. 

When("a user makes a GET request to the customer list", () => {
  // Make a GET request to the specified API endpoint
  cy.request({
    method: "GET",
    url: apiEndpoint,
  }).as("apiResponse").then(({ body }) => {
      responseBody = body;
      console.log(body); // Log the body for later debugging if something fails
    });
      cy.fixture("/customerDetails.json").then((data) => {
        expectedCustomers = data; //store the data in the variable for later user.
    });
    cy.get("@apiResponse").its("status").should("eq", 200);
  })

  Then(/^the response should contain correct customer data$/,() => {
      // Assert the response body contains some customer data
      cy.get("@apiResponse").its("body").should("have.length.greaterThan", 0);
      // Assert that the data in question has the correct properties structure
      cy.get('@apiResponse').its('body').each((customer) => {
      expect(customer).to.have.property("id");
      expect(customer).to.have.property("name");
      expect(customer).to.have.property("email");
      expect(customer).to.have.property("phone");
      })
      //Verify that it matches the expected response. 
      expect(responseBody).to.deep.equal(expectedCustomers);
    });

