import { memo } from "react";
import { CategorySelect } from "../../categories/components/category-select.tsx";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { AddSubscriptionButton } from "../components/add-subscription-button.tsx";
import { SubscriptionList } from "../components/subscription-list.tsx";
import { SubscriptionUpsert } from "../components/subscription-upsert.tsx";
import { useSubscriptionUpsertMode } from "../stores/subscription-upsert.store.tsx";

export const SubscriptionsPage = memo(() => {
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
			<SubscriptionList />
		</DefaultLayout>
	);
});
