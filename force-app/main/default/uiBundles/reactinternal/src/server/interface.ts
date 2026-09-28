type Field<T = string> = { value: T | null; displayValue?: string | null };

export type Connection<K extends string, N> = {
    uiapi: { query: Record<K, { edges: { node: N }[] }> };
};

export type AccountNode = { Id: string; Name: Field; Industry: Field; Phone: Field };

export type ContactNode = {
    Id: string;
    Name: Field;
    Email: Field;
    Account: { Name: Field } | null;
};

export type OpportunityNode = {
    Id: string;
    Name: Field;
    StageName: Field;
    Amount: Field<number>;
    CloseDate: Field;
};

export type AccountRow = {
    id: string;
    name: string;
    industry: string | null;
    phone: string | null;
};

export type ContactRow = {
    id: string;
    name: string;
    email: string | null;
    accountName: string | null;
};

export type OpportunityRow = {
    id: string;
    name: string;
    stage: string | null;
    amount: number | null;
    amountDisplay: string | null;
    closeDate: string | null;
};

export type RecordsByTab = {
    Accounts: AccountRow[];
    Contacts: ContactRow[];
    Opportunities: OpportunityRow[];
};