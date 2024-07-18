import type { Locator, Page } from "@playwright/test";
import type {
	CategoryModel,
	UpsertCategoryModel,
} from "../models/category.model.ts";
import { CategoryFormCom } from "./category-form.com.ts";

export class CategorySelectCom {
	manageButton: Locator;
	addButton: Locator;
	insertButton: Locator;
	updateButton: Locator;

	form: CategoryFormCom;

	constructor(private readonly page: Page) {
		this.manageButton = page.getByRole("button", { name: "manage" });
		this.addButton = page.getByRole("button", { name: "add category" });
		this.insertButton = this.page.getByRole("button", { name: "insert" });
		this.updateButton = this.page.getByRole("button", { name: "update" });

		this.form = new CategoryFormCom(this.page);
	}

	category({ name }: CategoryModel | UpsertCategoryModel): Locator {
		return this.page.getByRole("paragraph").filter({ hasText: name });
	}

	editButton({ name }: CategoryModel | UpsertCategoryModel): Locator {
		return this.page.getByRole("button", { name: `edit ${name} category` });
	}

	deleteButton({ name }: CategoryModel | UpsertCategoryModel): Locator {
		return this.page.getByRole("button", { name: `delete ${name} category` });
	}
}
