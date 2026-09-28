import { DataTable, type Column } from "@/components/data-table";
import type { ContactRow } from "@/server/interface";
import { useTabRecords } from "../hooks/use-tabs-records";

const columns: Column<ContactRow>[] = [
    { id: "name", header: "Name", accessor: (r) => r.name, className: "font-medium" },
    {
        id: "email",
        header: "Email",
        accessor: (r) => r.email,
        cell: (r) =>
            r.email ? (
                <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                    {r.email}
                </a>
            ) : (
                "—"
            ),
    },
    { id: "account", header: "Account", accessor: (r) => r.accountName },
];

export default function ContactsTable() {
    const { records, loading, error } = useTabRecords("Contacts");
    return (
        <DataTable
            data={records}
            columns={columns}
            loading={loading}
            error={error}
            searchPlaceholder="Search contacts…"
            emptyMessage="No contacts found."
        />
    );
}