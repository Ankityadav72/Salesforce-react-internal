import { Button } from "@/components/ui";
import { createDataSDK } from "@salesforce/platform-sdk/data";
import { useState } from "react";

type AccountDto = {
    id: string;
    name: string;
    industry?: string;
    phone?: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    count?: number;
    data?: AccountDto[];
};

type CallResult = {
    label: string;
    url: string;
    status: number | null;
    ok: boolean;
    body: string;
    ms: number;
};

const ApiTestingPage = () => {
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [result, setResult] = useState<CallResult | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const call = async (label: string, url: string) => {
        setLoading(label);
        const started = performance.now();
        try {
            const sdk = await createDataSDK();
            if (!sdk?.fetch) throw new Error("sdk.fetch is not available");

            const response = await sdk?.fetch?.(url);
            const body = await response.text();

            setResult({
                label,
                url,
                status: response.status,
                ok: response.ok,
                body,
                ms: Math.round(performance.now() - started),
            });
            return { response, body };
        } catch (e) {
            setResult({
                label,
                url,
                status: null,
                ok: false,
                body: e instanceof Error ? e.message : String(e),
                ms: Math.round(performance.now() - started),
            });
            return null;
        } finally {
            setLoading(null);
        }
    };

    // Standard endpoint, no Apex involved. Tests the session only.
    const testSession = () => call("Session test (limits)", "/services/data/v67.0/limits");

    // Your Apex REST endpoint (old class).
    const testOldApex = () => call("Old Apex (AccountApi)", "https://jsonplaceholder.typicode.com/todos/1");

    // New Apex REST endpoint.
    const testNewApex = async () => {
        const out = await call("New Apex (AccountsV2Api)", "/services/apexrest/accountsv2?limit=5");
        if (out?.response.ok) {
            try {
                const parsed: ApiResponse = JSON.parse(out.body);
                setAccounts(parsed.data ?? []);
            } catch {
                setAccounts([]);
            }
        }
    };

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button variant="outline" onClick={testSession} disabled={!!loading}>
                    1. Test session
                </Button>
                <Button variant="outline" onClick={testOldApex} disabled={!!loading}>
                    2. Old Apex
                </Button>
                <Button variant="outline" onClick={testNewApex} disabled={!!loading}>
                    3. New Apex
                </Button>
            </div>

            {loading && <p>Loading: {loading}...</p>}

            {result && (
                <div
                    style={{
                        border: "1px solid",
                        borderColor: result.ok ? "green" : "red",
                        borderRadius: 6,
                        padding: 12,
                    }}
                >
                    <strong>{result.label}</strong>
                    <div>URL: {result.url}</div>
                    <div>
                        Status: {result.status ?? "network/SDK error"} ({result.ms} ms)
                    </div>
                    <pre style={{ whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto" }}>
                        {result.body}
                    </pre>
                </div>
            )}

            {accounts.length > 0 && (
                <ul>
                    {accounts.map((a) => (
                        <li key={a.id}>
                            {a.name}
                            {a.industry && ` — ${a.industry}`}
                            {a.phone && ` — ${a.phone}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApiTestingPage;