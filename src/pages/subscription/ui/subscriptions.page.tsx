import { memo } from "react";
import { SelectCategory } from "../../../features/list-subscriptions/ui/select-category.tsx";
import { useUpsertSubscriptionMode } from "../../../features/upsert-subscription/model/upsert-subscription.store.tsx";
import { AddSubscriptionButton } from "../../../features/upsert-subscription/ui/add-subscription-button.tsx";
import { cn } from "../../../shared/ui/cn.ts";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../../shared/ui/default.layout.tsx";
import { ManageCategories } from "../../../widgets/category/ui/manage-categories.tsx";
import { SubscriptionList } from "../../../widgets/subscription/ui/subscription-list.tsx";
import { UpsertSubscription } from "../../../widgets/subscription/ui/upsert-subscription.tsx";

export const SubscriptionsPage = memo(() => {
	const mode = useUpsertSubscriptionMode();

	return (
		<DefaultLayout
			header={
				<DefaultLayoutHeader actions={<AddSubscriptionButton />}>
					<div className={cn("flex items-center gap-2")}>
						<SelectCategory />
						<ManageCategories />
					</div>
				</DefaultLayoutHeader>
			}
			drawerContent={<UpsertSubscription />}
			drawerTitle={`${mode === "update" ? "Update" : "Insert"} Subscription`}
		>
			<SubscriptionList />
		</DefaultLayout>
	);
});
