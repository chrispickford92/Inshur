Feature: Customer Listing API

    The purpose of these to tests is to verify that the customer data is accessible and is 
    being retrieved via the API successfully.

    Scenario: Verify accessibility of the API
        Given the API is accessible
        When the User makes a GET request to the "customerList" API
        Then the response should have a status code of 200

    Scenario: Verify customer list details via API response
        Given the customer list API is accessible at "/customerList"
        When a user makes a GET request to the customer list
        Then the response should contain correct customer data
     