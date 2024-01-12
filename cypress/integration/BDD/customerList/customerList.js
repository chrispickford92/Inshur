import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { byClass, byDataTest } from "../../../support/helpers";

let responseBody;
beforeEach(() => {
  cy.request({
    method: "GET",
    url: "/customerList",
  })
    .as("apiResponse") // store as an alias to assert later
    .then(({ body }) => {
      responseBody = body;
      console.log(body);
    });
});

let apiResponse;
//Scenario: Verify Customer Contact Data
Given(/^a user is on the "\/customerList" page$/, () => {
  cy.server();
  cy.route("/customerList").as("getCustomerList");
  cy.visit("http://localhost:3000");
  cy.wait("@getCustomerList").then((interception) => {
    console.log(interception.response.body);
  });
});

When(/^the customer list is displayed$/, (name) => {
  cy.get(byDataTest("4")).should("exist");
});

let expectedCustomers;

Then(/^the user can view the details of each customer$/, () => {
  cy.fixture("customerDetails.json").then((data) => {
    expectedCustomers = data;
  });

  cy.get("@apiResponse")
    .its("body")
    .each((customer, index) => {
      // Click on the customer
      cy.get(byDataTest(`${index + 1}`))
        .contains("Click to View Details")
        .click();
      // Verify the displayed details match the expected details for the selected customer
      cy.get(byClass("centeralign panel panel-info")).within(() => {
        cy.get(byClass("panel-body")).should("contain", customer.name);
        cy.get(byClass("panel-body")).should("contain", customer.email);
        cy.get(byClass("panel-body")).should("contain", customer.phone);
      });
    });
});

//Scenario: User can select each user in the list
//Repeated step no need to add the same code
//Given a user is on the "/customerList" page

let customerDetails;
When(/^the user selects "(.*)"$/, (name) => {
  if (name === "John Smith") {
    // If the name is John Smith, click on another customer's button.
    // This is a slightly dirty way of testing this, especially if the customer data changes
    // Would need to find a way to determine the top customer.
    cy.get(byClass("panel-heading"))
      .contains("Chris Pickford")
      .parentsUntil(byClass("centeralign panel panel-info"))
      .siblings(byClass("panel-body"))
      .within(() => {
        cy.get("button").contains("Click to View Details").click();
      });
  } else {
    cy.server();
    cy.route("GET", "/customers/*").as("customerDetails");
    cy.get(byClass("panel-heading"))
      .contains(name)
      .parentsUntil(byClass("centeralign panel panel-info"))
      .siblings(byClass("panel-body"))
      .within(() => {
        cy.get("button").contains("Click to View Details").click();
      });
    //intercept the call and store it for comparison later
    cy.wait("@customerDetails").then((interception) => {
      console.log("Response Body:", interception.response.body);
      customerDetails = interception.response.body;
    });
  }
});

Then(/^the page displays all of their information$/, () => {
  cy.get(byClass("centeralign panel panel-info")).within(() => {
    // Compare the data on the screen with the API response after clicking on the customer
    cy.contains(customerDetails.name).should("exist");
    cy.contains(customerDetails.email).should("exist");
    cy.contains(customerDetails.phone).should("exist");
    cy.contains(customerDetails.city).should("exist");
    cy.contains(customerDetails.state).should("exist");
    cy.contains(customerDetails.country).should("exist");
    cy.contains(customerDetails.organization).should("exist");
    cy.contains(customerDetails.jobProfile).should("exist");
    cy.contains(customerDetails.additionalInfo).should("exist");
  });
});
