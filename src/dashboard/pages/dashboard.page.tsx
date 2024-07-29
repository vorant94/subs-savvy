import { memo } from "react";
import { CategorySelect } from "../../categories/components/category-select.tsx";
import { AddSubscriptionButton } from "../../subscriptions/components/add-subscription-button.tsx";
import { SubscriptionUpsert } from "../../subscriptions/components/subscription-upsert.tsx";
import { useSubscriptionUpsert } from "../../subscriptions/hooks/use-subscription-upsert";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { ExpensesByCategory } from "../components/expenses-by-category.tsx";
import { ExpensesPerMonth } from "../components/expenses-per-month.tsx";
import { UpcomingPayments } from "../components/upcoming-payments.tsx";

export const DashboardPage = memo(() => {
	const upsert = useSubscriptionUpsert();

	return (
		<DefaultLayout
			header={
				<DefaultLayoutHeader actions={<AddSubscriptionButton />}>
					<CategorySelect />
				</DefaultLayoutHeader>
			}
			drawerContent={<SubscriptionUpsert />}
			drawerTitle={`${upsert.state.mode === "update" ? "Update" : "Insert"} Subscription`}
		>
			<div
				className={cn(
					"grid flex-1 auto-rows-[calc(50%-8px)] grid-cols-1 gap-4 lg:grid-cols-2",
				)}
			>
				<ExpensesPerMonth />

				<UpcomingPayments />

				<div className={cn("flex")}>
					<ExpensesByCategory />
				</div>
			</div>
		</DefaultLayout>
	);
});
