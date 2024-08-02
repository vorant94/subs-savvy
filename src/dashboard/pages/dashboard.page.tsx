import { memo } from "react";
import { CategorySelect } from "../../categories/components/category-select.tsx";
import { AddSubscriptionButton } from "../../subscriptions/components/add-subscription-button.tsx";
import { SubscriptionUpsert } from "../../subscriptions/components/subscription-upsert.tsx";
import { useSubscriptionUpsertMode } from "../../subscriptions/stores/subscription-upsert.store.tsx";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { ExpensesByCategory } from "../components/expenses-by-category.tsx";
import { ExpensesPerMonth } from "../components/expenses-per-month.tsx";

export const DashboardPage = memo(() => {
	const subscriptionUpsertMode = useSubscriptionUpsertMode();

	return (
		<DefaultLayout
			header={
				<DefaultLayoutHeader actions={<AddSubscriptionButton />}>
					<CategorySelect />
				</DefaultLayoutHeader>
			}
			drawerContent={<SubscriptionUpsert />}
			drawerTitle={`${subscriptionUpsertMode === "update" ? "Update" : "Insert"} Subscription`}
		>
			<div className={cn("flex flex-col items-start gap-8")}>
				<ExpensesPerMonth />

				{/*<UpcomingPayments />*/}

				<ExpensesByCategory />
			</div>
		</DefaultLayout>
	);
});
