import { Button, Stepper } from "@mantine/core";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoriesInsertTable } from "../../categories/components/categories-insert-table.tsx";
import { SubscriptionsInsertTable } from "../../subscriptions/components/subscriptions-insert-table.tsx";
import { cn } from "../../ui/utils/cn.ts";
import { RecoveryImportDropZone } from "../components/recovery-import-drop-zone.tsx";
import {
	type RecoveryImportStateStage,
	useRecoveryImport,
	useRecoveryImportActions,
} from "../stores/recovery-import.store.ts";

// TODO improve performance (parsing a lot of sub makes UI lag)
export const RecoveryImportPage = memo(() => {
	const { stage, subscriptions, categories } = useRecoveryImport();
	const {
		goNextFromUploadRecovery,
		goNextFromSubmitCategories,
		goNextFromSubmitSubscriptions,
	} = useRecoveryImportActions();

	const [subscriptionsFormId, setSubscriptionsFormId] = useState("");
	const updateSubscriptionsFormId: (ref: HTMLFormElement | null) => void =
		useCallback(
			(ref) => setSubscriptionsFormId(ref?.getAttribute("id") ?? ""),
			[],
		);

	const [categoriesFormId, setCategoriesFormId] = useState("");
	const updateCategoriesFormId: (ref: HTMLFormElement | null) => void =
		useCallback(
			(ref) => setCategoriesFormId(ref?.getAttribute("id") ?? ""),
			[],
		);

	const [active, setActive] = useState(0);
	useEffect(() => setActive(stageToActive[stage]), [stage]);

	const { t } = useTranslation();

	return (
		<Stepper active={active}>
			<Stepper.Step label={t("upload-recovery")}>
				<div className={cn("flex flex-col")}>
					<RecoveryImportDropZone onRecoveryParsed={goNextFromUploadRecovery} />
				</div>
			</Stepper.Step>
			<Stepper.Step label={t("submit-categories")}>
				<div className={cn("flex flex-col gap-2")}>
					<CategoriesInsertTable
						categories={categories}
						ref={updateCategoriesFormId}
						onSubmit={goNextFromSubmitCategories}
					/>

					<Button
						className={cn("self-end")}
						form={categoriesFormId}
						type="submit"
					>
						{t("submit")}
					</Button>
				</div>
			</Stepper.Step>
			<Stepper.Step label={t("submit-subscriptions")}>
				<div className={cn("flex flex-col gap-2")}>
					<SubscriptionsInsertTable
						subscriptions={subscriptions}
						categories={categories}
						ref={updateSubscriptionsFormId}
						onSubmit={goNextFromSubmitSubscriptions}
					/>

					<Button
						className={cn("self-end")}
						form={subscriptionsFormId}
						type="submit"
					>
						{t("submit")}
					</Button>
				</div>
			</Stepper.Step>
			<Stepper.Completed>
				{/*TODO implement UI here*/}
				completed/failed
			</Stepper.Completed>
		</Stepper>
	);
});

const stageToActive = {
	"upload-recovery": 0,
	"submit-categories": 1,
	"submit-subscriptions": 2,
	failed: 3,
	completed: 3,
} satisfies Record<RecoveryImportStateStage, number>;
