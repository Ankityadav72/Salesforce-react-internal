import { type ComponentType } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import useTabs from "./hooks/use-tabs";
import AccountsTable from "./tables/accounts-table";
import ContactsTable from "./tables/contacts-table";
import OpportunitiesTable from "./tables/opportunities-table";

export const TABS = ["Accounts", "Contacts", "Opportunities"] as const;
export type TabName = (typeof TABS)[number];

const TAB_PANELS: Record<TabName, ComponentType> = {
	Accounts: AccountsTable,
	Contacts: ContactsTable,
	Opportunities: OpportunitiesTable,
};

export default function HomePage() {
	const { selectedTab, handleTabChange } = useTabs({ currentTab: TABS[0] });

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
			<Tabs value={selectedTab} onValueChange={(v) => handleTabChange(v as TabName)} className="gap-4">
				<TabsList className="bg-background gap-4 border p-1.5 h-auto">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab}
							value={tab}
							className="px-6 py-2.5 data-active:bg-primary! data-active:text-primary-foreground! dark:data-active:border-transparent!"
						>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				{TABS.map((tab) => {
					const Panel = TAB_PANELS[tab];
					return (
						<TabsContent key={tab} value={tab}>
							<Panel />
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}