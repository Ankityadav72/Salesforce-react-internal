import { DataTable, type Column } from "@/components/data-table";
import type { AccountRow } from "@/server/interface";
import { useTabRecords } from "../hooks/use-tabs-records";

const columns: Column<AccountRow>[] = [
    { id: "name", header: "Account Name", accessor: (r) => r.name, className: "font-medium" },
    { id: "industry", header: "Industry", accessor: (r) => r.industry },
    { id: "phone", header: "Phone", accessor: (r) => r.phone },
];

export default function AccountsTable() {
    const { records, loading, error } = useTabRecords("Accounts");
    return (
        <DataTable
            data={records}
            columns={columns}
            loading={loading}
            error={error}
            searchPlaceholder="Search accounts…"
            emptyMessage="No accounts found."
        />
    );
}