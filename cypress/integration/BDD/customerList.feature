Feature: Customer Listing

    Background: The purpose of these to tests is to verify the customer data is being displayed as expected on the frontend.



    Scenario: Verify Customer Contact Data
        Given a user is on the "/customerList" page
        When the customer list is displayed
        Then the user can view the details of each customer

    Scenario Outline: User can select each user in the list
        Given a user is on the "/customerList" page
        When the user selects "<name>"
        Then the page displays all of their information
        Examples:
            | name           |
            | Chris Pickford |
            | John Smith     |
            | Jeff Bridges   |
            | Steve Jones    |


