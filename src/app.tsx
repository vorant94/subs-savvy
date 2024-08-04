import {
	faChartSimple,
	faClockRotateLeft,
	faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import { CategoriesProvider } from "./categories/stores/categories.store.tsx";
import { ImportRecoveryProvider } from "./recovery/stores/import-recovery.store.tsx";
import { SubscriptionsProvider } from "./subscriptions/stores/subscriptions.store.tsx";
import { UpsertSubscriptionProvider } from "./subscriptions/stores/upsert-subscription.store.tsx";
import { BreakpointsProvider } from "./ui/hooks/use-breakpoint.tsx";
import { DefaultLayoutProvider } from "./ui/hooks/use-default-layout.tsx";
import { type NavLink, NavLinksProvider } from "./ui/hooks/use-nav-links.tsx";
import { rootRoute } from "./ui/types/root-route.ts";

export const App = memo(() => {
	return (
		<NavLinksProvider
			topNavLinks={topNavLinks}
			bottomNavLinks={bottomNavLinks}
		>
			<BreakpointsProvider>
				<DefaultLayoutProvider>
					<UpsertSubscriptionProvider>
						<CategoriesProvider>
							<SubscriptionsProvider>
								<ImportRecoveryProvider>
									<Outlet />
								</ImportRecoveryProvider>
							</SubscriptionsProvider>
						</CategoriesProvider>
					</UpsertSubscriptionProvider>
				</DefaultLayoutProvider>
			</BreakpointsProvider>
		</NavLinksProvider>
	);
});

const topNavLinks = [
	{
		label: "dashboard",
		path: `/${rootRoute.dashboard}`,
		icon: <FontAwesomeIcon icon={faChartSimple} />,
	},
	{
		label: "subscriptions",
		path: `/${rootRoute.subscriptions}`,
		icon: <FontAwesomeIcon icon={faCreditCard} />,
	},
] as const satisfies Array<NavLink>;

const bottomNavLinks = [
	{
		label: "recovery",
		path: `/${rootRoute.recovery}`,
		icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
	},
] as const satisfies Array<NavLink>;
