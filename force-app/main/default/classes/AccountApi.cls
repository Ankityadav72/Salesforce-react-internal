@RestResource(urlMapping='/accounts/*')
global with sharing class AccountApi {

    Account test = new Account(Name = 'Ankit');
    sObject test2 = new Account(Name = 'Ankur');
    Account acct = (Account)myGenericSObject;
    String name = acct.Name;
    String phone = acct.Phone;

    @HttpGet
    global static List<Account> getAccounts() {

        RestRequest req = RestContext.request;

        String limitParam = req.params.get('limit');
        Integer limitValue = 10;

        if (limitParam != null) {
            limitValue = Integer.valueOf(limitParam);
        }

        return [
            SELECT Id, Name, Industry, Phone
            FROM Account
            LIMIT :limitValue
        ];
    }
}