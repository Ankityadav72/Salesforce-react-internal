import { DataTable, type Column } from "@/components/data-table";
import type { OpportunityRow } from "@/server/interface";
import { useTabRecords } from "../hooks/use-tabs-records";

const formatDate = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC", // Salesforce dates have no time zone
        })
        : null;

const columns: Column<OpportunityRow>[] = [
    { id: "name", header: "Opportunity", accessor: (r) => r.name, className: "font-medium" },
    {
        id: "stage",
        header: "Stage",
        accessor: (r) => r.stage,
        cell: (r) =>
            r.stage ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{r.stage}</span>
            ) : (
                "—"
            ),
    },
    {
        id: "amount",
        header: "Amount",
        accessor: (r) => r.amountDisplay ?? r.amount,
        className: "text-right tabular-nums",
    },
    { id: "closeDate", header: "Close Date", accessor: (r) => formatDate(r.closeDate) },
];

export default function OpportunitiesTable() {
    const { records, loading, error } = useTabRecords("Opportunities");
    return (
        <DataTable
            data={records}
            columns={columns}
            loading={loading}
            error={error}
            searchPlaceholder="Search opportunities…"
            emptyMessage="No opportunities found."
        />
    );
}