import { Button } from "@/components/ui";
import { createDataSDK } from "@salesforce/platform-sdk";
import { useState } from "react";

type Account = {
    Id: string;
    Name: string;
    Industry?: string;
    Phone?: string;
};

const ApiTestingPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getAccountsData = async (limit: number) => {
        setLoading(true);
        setError(null);
        try {
            const sdk = await createDataSDK();
            const response = await sdk.fetch?.(
                `/services/apexrest/accounts?limit=${encodeURIComponent(limit)}`
            );

            if (!response) {
                setError("fetch is not available in this environment");
                return;
            }
            if (!response.ok) {
                const body = await response.text();
                setError(`HTTP ${response.status}: ${body}`);
                return;
            }

            const data: Account[] = await response.json();
            setAccounts(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button variant="outline" onClick={() => getAccountsData(1)} disabled={loading}>
                {loading ? "Loading..." : "Get Accounts Data"}
            </Button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {accounts.length > 0 && (
                <>
                    <p>Account data:</p>
                    <ul>
                        {accounts.map((a) => (
                            <li key={a.Id}>
                                {a.Name} {a.Industry ? `— ${a.Industry}` : ""}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ApiTestingPage;