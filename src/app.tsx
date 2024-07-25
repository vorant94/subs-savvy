import {
	faChartSimple,
	faClockRotateLeft,
	faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import { appI18n } from "./app.i18n.ts";
import { SubscriptionUpsertProvider } from "./subscriptions/hooks/use-subscription-upsert.tsx";
import { SubscriptionsProvider } from "./subscriptions/hooks/use-subscriptions.tsx";
import { DefaultLayoutProvider } from "./ui/hooks/use-default-layout.tsx";
import { type NavLink, NavLinksProvider } from "./ui/hooks/use-nav-links.tsx";
import { rootRoute } from "./ui/types/root-route.ts";

export const App = memo(() => {
	return (
		<NavLinksProvider
			topNavLinks={topNavLinks}
			bottomNavLinks={bottomNavLinks}
		>
			<DefaultLayoutProvider>
				<SubscriptionUpsertProvider>
					<SubscriptionsProvider>
						<Outlet />
					</SubscriptionsProvider>
				</SubscriptionUpsertProvider>
			</DefaultLayoutProvider>
		</NavLinksProvider>
	);
});

const topNavLinks = [
	{
		label: appI18n.dashboard,
		path: `/${rootRoute.dashboard}`,
		icon: <FontAwesomeIcon icon={faChartSimple} />,
	},
	{
		label: appI18n.subscriptions,
		path: `/${rootRoute.subscriptions}`,
		icon: <FontAwesomeIcon icon={faCreditCard} />,
	},
] as const satisfies Array<NavLink>;

const bottomNavLinks = [
	{
		label: appI18n.recovery,
		path: `/${rootRoute.recovery}`,
		icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
	},
] as const satisfies Array<NavLink>;
