import { memo } from "react";
import { SelectCategory } from "../../categories/components/select-category.tsx";
import { AddSubscriptionButton } from "../../subscriptions/components/add-subscription-button.tsx";
import { UpsertSubscription } from "../../subscriptions/components/upsert-subscription.tsx";
import { useUpsertSubscriptionMode } from "../../subscriptions/stores/upsert-subscription.store.tsx";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { ExpensesByCategory } from "../components/expenses-by-category.tsx";
import { ExpensesPerMonth } from "../components/expenses-per-month.tsx";

export const DashboardPage = memo(() => {
	const mode = useUpsertSubscriptionMode();

	return (
		<DefaultLayout
			header={
				<DefaultLayoutHeader actions={<AddSubscriptionButton />}>
					<SelectCategory />
				</DefaultLayoutHeader>
			}
			drawerContent={<UpsertSubscription />}
			drawerTitle={`${mode === "update" ? "Update" : "Insert"} Subscription`}
		>
			<div className={cn("flex flex-col items-start gap-8")}>
				<ExpensesPerMonth />

				{/*<UpcomingPayments />*/}

				<ExpensesByCategory />
			</div>
		</DefaultLayout>
	);
});
