import { useMemo, useState } from "react";
import type { Column } from "./types";

export function useTableControls<T>(data: T[], columns: Column<T>[], pageSize: number) {
    const [query, setQueryState] = useState("");
    const [page, setPageState] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        const searchable = columns.filter((c) => c.searchable !== false);
        return data.filter((row) =>
            searchable.some((c) => String(c.accessor(row) ?? "").toLowerCase().includes(q))
        );
    }, [data, columns, query]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, pageCount); // stays valid if results shrink
    const start = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);

    const setQuery = (value: string) => {
        setQueryState(value);
        setPageState(1);
    };
    const setPage = (p: number) => setPageState(Math.min(Math.max(1, p), pageCount));

    return {
        query,
        setQuery,
        page: currentPage,
        pageCount,
        setPage,
        pageRows,
        totalCount: filtered.length,
        from: filtered.length ? start + 1 : 0,
        to: start + pageRows.length,
    };
}