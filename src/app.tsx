import {
	faChartSimple,
	faClockRotateLeft,
	faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CategoriesProvider } from "./categories/stores/categories.store.tsx";
import {
	useRecoveryImportActions,
	useRecoveryImportStage,
} from "./recovery/stores/recovery-import.store.ts";
import { recoveryRoute } from "./recovery/types/recovery-route.ts";
import { SubscriptionUpsertProvider } from "./subscriptions/stores/subscription-upsert.store.tsx";
import { SubscriptionsProvider } from "./subscriptions/stores/subscriptions.store.tsx";
import { BreakpointsProvider } from "./ui/hooks/use-breakpoint.tsx";
import { DefaultLayoutProvider } from "./ui/hooks/use-default-layout.tsx";
import { type NavLink, NavLinksProvider } from "./ui/hooks/use-nav-links.tsx";
import { rootRoute } from "./ui/types/root-route.ts";

export const App = memo(() => {
	const { pathname } = useLocation();
	const stage = useRecoveryImportStage();
	const { reset } = useRecoveryImportActions();
	useEffect(
		() => () => {
			if (
				stage !== "upload-recovery" &&
				pathname !== `/${rootRoute.recovery}/${recoveryRoute.import}`
			) {
				reset();
			}
		},
		[pathname, stage, reset],
	);

	return (
		<NavLinksProvider
			topNavLinks={topNavLinks}
			bottomNavLinks={bottomNavLinks}
		>
			<BreakpointsProvider>
				<DefaultLayoutProvider>
					<SubscriptionUpsertProvider>
						<CategoriesProvider>
							<SubscriptionsProvider>
								<Outlet />
							</SubscriptionsProvider>
						</CategoriesProvider>
					</SubscriptionUpsertProvider>
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
