@IsTest
private class AccountApiTest {
    @IsTest
    static void returnsAccounts() {
        insert new Account(Name = 'Test Co');
        List<Account> result = AccountApi.getAccounts();
        Assert.areEqual(1, result.size());
    }
}