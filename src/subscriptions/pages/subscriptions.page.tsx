import { memo } from "react";
import { CategorySelect } from "../../categories/components/category-select.tsx";
import {
	DefaultLayout,
	DefaultLayoutHeader,
} from "../../ui/layouts/default.layout.tsx";
import { AddSubscriptionButton } from "../components/add-subscription-button.tsx";
import { SubscriptionList } from "../components/subscription-list.tsx";
import { SubscriptionUpsert } from "../components/subscription-upsert.tsx";
import { useSubscriptionUpsert } from "../hooks/use-subscription-upsert.tsx";

export const SubscriptionsPage = memo(() => {
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
			<SubscriptionList />
		</DefaultLayout>
	);
});
