Feature: Customer search

    @demo @debug
    Scenario Outline: <TestID>: Search external customers
        Given Get list of users from reqres.in
        When As ADMIN user login to nopcommerce site
        Then Verify if all users exists in customers list

        Examples:
            | TestID    |
            | E2E_TC001 |