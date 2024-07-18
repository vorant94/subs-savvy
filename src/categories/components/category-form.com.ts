import type { Page } from "@playwright/test";
import { InputCom } from "../../ui/components/input.com";
import type { UpsertCategoryModel } from "../models/category.model.ts";

export class CategoryFormCom {
	nameControl: InputCom;
	colorControl: InputCom;

	constructor(private readonly page: Page) {
		this.nameControl = new InputCom(this.page.getByLabel("name"));
		this.colorControl = new InputCom(this.page.getByLabel("color"));
	}

	async fill(category: UpsertCategoryModel): Promise<void> {
		await this.nameControl.fill(category.name);
		await this.colorControl.fill(category.color);
	}
}
