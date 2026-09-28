import { useEffect, useState } from "react";
import type { TabName } from "../Home";
import type { RecordsByTab } from "@/server/interface";
import { fetchRecordsByTab } from "@/server/api";

type Result<T extends TabName> = {
    tab: T;
    records: RecordsByTab[T];
    error: string | null;
};

export function useTabRecords<T extends TabName>(tab: T) {
    const [result, setResult] = useState<Result<T> | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchRecordsByTab(tab)
            .then((records) => {
                if (!cancelled) setResult({ tab, records, error: null });
            })
            .catch((err) => {
                if (!cancelled)
                    setResult({
                        tab,
                        records: [] as RecordsByTab[T],
                        error: err instanceof Error ? err.message : String(err),
                    });
            });

        return () => {
            cancelled = true;
        };
    }, [tab]);

    if (!result || result.tab !== tab) {
        return { records: [] as RecordsByTab[T], loading: true, error: null as string | null };
    }
    return { records: result.records, loading: false, error: result.error };
}