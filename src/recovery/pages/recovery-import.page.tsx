import { Button } from "@mantine/core";
import { memo, useCallback, useState } from "react";
import { SubscriptionsInsertTable } from "../../subscriptions/components/subscriptions-insert-table.tsx";
import {
	insertSubscriptionSchema,
	type InsertSubscriptionModel,
} from "../../subscriptions/models/subscription.model.ts";
import { cn } from "../../ui/utils/cn.ts";
import {
	RecoveryImportDropZone,
	type RecoveryImportDropZoneProps,
} from "../components/recovery-import-drop-zone.tsx";

export const RecoveryImportPage = memo(() => {
	const [subscriptions, setSubscriptions] = useState<
		Array<InsertSubscriptionModel>
	>([]);

	const setSubscriptionFromRecovery: RecoveryImportDropZoneProps["onRecoveryParsed"] =
		useCallback(({ subscriptions }) => {
			setSubscriptions(
				subscriptions.map((subscription) =>
					insertSubscriptionSchema.parse(subscription),
				),
			);
		}, []);

	const [formId, setFormId] = useState("");
	const updateFormId: (ref: HTMLFormElement | null) => void = useCallback(
		(ref) => setFormId(ref?.getAttribute("id") ?? ""),
		[],
	);

	const clearSubscriptions = useCallback(() => {
		setSubscriptions([]);
	}, []);

	return (
		<div className={cn("flex flex-col gap-4")}>
			<RecoveryImportDropZone onRecoveryParsed={setSubscriptionFromRecovery} />

			{subscriptions.length ? (
				<>
					<SubscriptionsInsertTable
						subscriptions={subscriptions}
						ref={updateFormId}
						onInsert={clearSubscriptions}
					/>

					<div className={cn("flex items-center")}>
						<div className={cn("flex-1")} />

						<Button
							form={formId}
							type="submit"
						>
							import
						</Button>
					</div>
				</>
			) : null}
		</div>
	);
});
