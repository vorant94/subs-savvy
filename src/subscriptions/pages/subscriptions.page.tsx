import { memo } from "react";
import { SelectCategory } from "../../categories/components/select-category.tsx";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { AddSubscriptionButton } from "../components/add-subscription-button.tsx";
import { SubscriptionList } from "../components/subscription-list.tsx";
import { UpsertSubscription } from "../components/upsert-subscription.tsx";
import { useUpsertSubscriptionMode } from "../stores/upsert-subscription.store.tsx";

export const SubscriptionsPage = memo(() => {
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
			<SubscriptionList />
		</DefaultLayout>
	);
});
