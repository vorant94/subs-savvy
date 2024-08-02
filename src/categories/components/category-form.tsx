import { zodResolver } from "@hookform/resolvers/zod";
import { ColorInput, NumberInput, TextInput } from "@mantine/core";
import { forwardRef, memo } from "react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";
import { cn } from "../../ui/utils/cn.ts";
import {
	type UpsertCategoryModel,
	insertCategorySchema,
	updateCategorySchema,
} from "../models/category.model.ts";
import {
	useCategoryUpsertActions,
	useCategoryUpsertState,
} from "../stores/category-upsert.store.tsx";

export const CategoryForm = memo(
	forwardRef<HTMLFormElement>((_, ref) => {
		const state = useCategoryUpsertState();
		const actions = useCategoryUpsertActions();

		const {
			register,
			handleSubmit,
			control,
			formState: { errors },
		} = useForm<UpsertCategoryModel>({
			resolver: zodResolver(
				state.mode === "update" ? updateCategorySchema : insertCategorySchema,
			),
			defaultValues: state.mode === "update" ? state.category : defaultValues,
		});

		return (
			<form
				id="categoryForm"
				ref={ref}
				onSubmit={handleSubmit(actions.upsert)}
				className={cn("flex flex-col gap-2 self-stretch")}
			>
				<Controller
					control={control}
					name="id"
					render={({ field: { onChange, onBlur, value } }) => (
						<NumberInput
							value={value}
							onBlur={onBlur}
							onChange={onChange}
							className={cn("hidden")}
						/>
					)}
				/>

				<TextInput
					{...register("name")}
					label="Name"
					placeholder="Name"
					type="text"
					autoComplete="off"
					error={errors.name?.message}
				/>

				<Controller
					control={control}
					name="color"
					render={({ field: { onChange, onBlur, value } }) => (
						<ColorInput
							value={value}
							onChange={onChange}
							onBlur={onBlur}
							label="Color"
							placeholder="Color"
							error={errors.color?.message}
						/>
					)}
				/>
			</form>
		);
	}),
);

const defaultValues: DefaultValues<UpsertCategoryModel> = {};
