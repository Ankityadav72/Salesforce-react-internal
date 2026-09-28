import type { TabName } from "@/pages/Home";
import { createDataSDK } from "@salesforce/platform-sdk/data";
import type {
    AccountNode, AccountRow, Connection, ContactNode, ContactRow,
    OpportunityNode, OpportunityRow, RecordsByTab,
} from "./interface";
import { ACCOUNTS_QUERY, CONTACTS_QUERY, OPPORTUNITIES_QUERY } from "./query";

let sdkPromise: ReturnType<typeof createDataSDK> | undefined;
const getSdk = () => (sdkPromise ??= createDataSDK());

async function runQuery<K extends string, N>(query: string, objectName: K, first: number): Promise<N[]> {
    const sdk = await getSdk();
    const result = await sdk.graphql?.query<Connection<K, N>>({ query, variables: { first } });

    if (!result) throw new Error("GraphQL isn't available in this environment");
    if (result.errors?.length) throw new Error(result.errors.map((e) => e.message).join(", "));
    return result.data?.uiapi.query[objectName]?.edges.map((e) => e.node) ?? [];
}

async function fetchAccounts(first: number): Promise<AccountRow[]> {
    const nodes = await runQuery<"Account", AccountNode>(ACCOUNTS_QUERY, "Account", first);
    return nodes.map((n) => ({
        id: n.Id,
        name: n.Name.value ?? "Unnamed account",
        industry: n.Industry.value,
        phone: n.Phone.value,
    }));
}

async function fetchContacts(first: number): Promise<ContactRow[]> {
    const nodes = await runQuery<"Contact", ContactNode>(CONTACTS_QUERY, "Contact", first);
    return nodes.map((n) => ({
        id: n.Id,
        name: n.Name.value ?? "Unnamed contact",
        email: n.Email.value,
        accountName: n.Account?.Name.value ?? null,
    }));
}

async function fetchOpportunities(first: number): Promise<OpportunityRow[]> {
    const nodes = await runQuery<"Opportunity", OpportunityNode>(OPPORTUNITIES_QUERY, "Opportunity", first);
    return nodes.map((n) => ({
        id: n.Id,
        name: n.Name.value ?? "Unnamed opportunity",
        stage: n.StageName.value,
        amount: n.Amount.value,
        amountDisplay: n.Amount.displayValue ?? null,
        closeDate: n.CloseDate.value,
    }));
}

const fetchers: { [K in TabName]: (first: number) => Promise<RecordsByTab[K]> } = {
    Accounts: fetchAccounts,
    Contacts: fetchContacts,
    Opportunities: fetchOpportunities,
};

export function fetchRecordsByTab<T extends TabName>(tab: T, first = 200): Promise<RecordsByTab[T]> {
    return fetchers[tab](first);
}