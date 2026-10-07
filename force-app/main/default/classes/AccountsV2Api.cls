@RestResource(urlMapping='/accountsv2/*')
global with sharing class AccountsV2Api {

    global class AccountDto {
        public String id;
        public String name;
        public String industry;
        public String phone;
    }

    global class ApiResponse {
        public Boolean success;
        public String message;
        public Integer count;
        public List<AccountDto> data;
    }

    @HttpGet
    global static ApiResponse getAccounts() {
        ApiResponse res = new ApiResponse();
        try {
            Integer limitValue = 10;
            String limitParam = RestContext.request.params.get('limit');
            if (String.isNotBlank(limitParam) && limitParam.isNumeric()) {
                limitValue = Math.min(Integer.valueOf(limitParam), 50);
            }

            List<AccountDto> dtos = new List<AccountDto>();
            for (Account a : [
                SELECT Id, Name, Industry, Phone
                FROM Account
                WITH USER_MODE
                ORDER BY Name
                LIMIT :limitValue
            ]) {
                AccountDto d = new AccountDto();
                d.id = a.Id;
                d.name = a.Name;
                d.industry = a.Industry;
                d.phone = a.Phone;
                dtos.add(d);
            }

            res.success = true;
            res.count = dtos.size();
            res.data = dtos;
        } catch (Exception e) {
            RestContext.response.statusCode = 500;
            res.success = false;
            res.message = e.getMessage();
        }
        return res;
    }
}