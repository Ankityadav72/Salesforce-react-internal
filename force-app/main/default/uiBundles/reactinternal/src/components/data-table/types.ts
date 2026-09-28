import type { ReactNode } from "react";

export type Column<T> = {
    id: string;
    header: string;
    accessor: (row: T) => string | number | null | undefined;
    cell?: (row: T) => ReactNode;
    searchable?: boolean;
    className?: string;
};