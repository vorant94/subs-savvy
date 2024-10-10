import { Button, Switch } from "@mantine/core";
import { memo, useCallback, useState } from "react";
import { useSubscriptions } from "../../../entities/subscription/model/subscriptions.store.tsx";
import { SelectSubscriptionsTable } from "../../../features/export-recovery/ui/select-subscriptions-table.tsx";
import { recoverySchema } from "../../../shared/api/recovery.model.ts";
import { dbVersion } from "../../../shared/lib/db.ts";
import { cn } from "../../../shared/ui/cn.ts";

export const ExportRecoveryPage = memo(() => {
	const subscriptions = useSubscriptions();
	const [selectedIds, setSelectedIds] = useState<Array<number>>([]);

	const [isPrettify, setIsPrettify] = useState(true);
	const toggleIsPrettify = useCallback(() => {
		setIsPrettify(!isPrettify);
	}, [isPrettify]);

	const exportSubscriptions = useCallback(() => {
		const subscriptionsToExport = subscriptions.filter((subscription) =>
			selectedIds.includes(subscription.id),
		);
		const subscriptionsExport = recoverySchema.parse({
			dbVersion,
			subscriptions: subscriptionsToExport,
			// TODO implement export of categories as well
			categories: [],
		});
		const jsonToExport = isPrettify
			? JSON.stringify(subscriptionsExport, null, 2)
			: JSON.stringify(subscriptionsExport);
		const blobToExport = new Blob([jsonToExport], { type: "application/json" });

		const exportLink = document.createElement("a");
		exportLink.href = URL.createObjectURL(blobToExport);
		exportLink.download = "subscriptions.json";
		document.body.appendChild(exportLink);
		exportLink.click();
		document.body.removeChild(exportLink);
	}, [isPrettify, selectedIds, subscriptions]);

	return (
		<div className={cn("flex flex-col gap-4")}>
			<SelectSubscriptionsTable
				subscriptions={subscriptions}
				selectedIds={selectedIds}
				setSelectedIds={setSelectedIds}
			/>

			<div className={cn("flex items-center")}>
				<Switch
					checked={isPrettify}
					onChange={toggleIsPrettify}
					label="Prettify"
				/>

				<div className={cn("flex-1")} />

				<Button
					disabled={selectedIds.length === 0}
					onClick={exportSubscriptions}
				>
					export
				</Button>
			</div>
		</div>
	);
});