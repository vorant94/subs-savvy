import type { Page } from "@playwright/test";
import { InputCom } from "../../ui/components/input.com";
import type { UpsertCategoryModel } from "../models/category.model.ts";

export class CategoryFormCom {
	readonly nameControl: InputCom;
	readonly colorControl: InputCom;

	constructor(page: Page) {
		this.nameControl = new InputCom(page.getByLabel("Name", { exact: true }));
		this.colorControl = new InputCom(page.getByLabel("color"));
	}

	async fill(category: UpsertCategoryModel): Promise<void> {
		await this.nameControl.fill(category.name);
		await this.colorControl.fill(category.color);
	}
}
