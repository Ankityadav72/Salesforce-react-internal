@RestResource(urlMapping='/accounts')
global with sharing class AccountApi {

    @HttpGet
    global static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, Phone
            FROM Account
            WITH USER_MODE
            ORDER BY Name
            LIMIT 50
        ];
    }
}