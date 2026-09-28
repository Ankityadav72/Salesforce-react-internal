import type { ReactNode } from "react";
import {
    Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui";
import type { Column } from "./types";
import { useTableControls } from "./use-table-controls";

type DataTableProps<T extends { id: string }> = {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    pageSize?: number;
    searchPlaceholder?: string;
    emptyMessage?: string;
};

export function DataTable<T extends { id: string }>({
    data,
    columns,
    loading = false,
    error = null,
    pageSize = 5,
    searchPlaceholder = "Search…",
    emptyMessage = "No records found.",
}: DataTableProps<T>) {
    const { query, setQuery, page, pageCount, setPage, pageRows, totalCount, from, to } =
        useTableControls(data, columns, pageSize);

    const messageRow = (content: ReactNode, className = "text-muted-foreground") => (
        <TableRow>
            <TableCell colSpan={columns.length} className={`h-24 text-center ${className}`}>
                {content}
            </TableCell>
        </TableRow>
    );

    let body: ReactNode;
    if (loading) body = messageRow("Loading…");
    else if (error) body = messageRow(`Couldn't load data: ${error}`, "text-destructive");
    else if (!pageRows.length) body = messageRow(query ? `No results for "${query}"` : emptyMessage);
    else
        body = pageRows.map((row) => (
            <TableRow key={row.id}>
                {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                        {col.cell ? col.cell(row) : (col.accessor(row) ?? "—")}
                    </TableCell>
                ))}
            </TableRow>
        ));

    return (
        <div className="space-y-4">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                disabled={loading || !!error}
                className="max-w-sm"
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.id} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>{body}</TableBody>
                </Table>
            </div>

            {!loading && !error && totalCount > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {from}–{to} of {totalCount}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                            Previous
                        </Button>
                        <span>
                            Page {page} of {pageCount}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= pageCount}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}