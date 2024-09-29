import type { Locator, Page } from "@playwright/test";
import { recoveryRoute } from "../../src/shared/lib/route.ts";
import { rootRoute } from "../../src/shared/lib/route.ts";
import { CheckboxCom } from "../coms/checkbox.com.ts";

export class ExportRecoveryPom {
	readonly recoveryNavLink: Locator;
	readonly exportTab: Locator;
	readonly exportButton: Locator;

	readonly selectAllSubscriptions: CheckboxCom;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.recoveryNavLink = this.#page.getByRole("link", { name: "recovery" });
		this.exportTab = this.#page.getByRole("tab", { name: "export" });
		this.exportButton = this.#page.getByRole("button", { name: "export" });

		this.selectAllSubscriptions = new CheckboxCom(
			this.#page.getByLabel("select all subscriptions"),
		);
	}

	async goto() {
		await this.#page.goto("/");
		await this.recoveryNavLink.click();
		await this.exportTab.click();
		await this.#page.waitForURL(
			`/${rootRoute.recovery}/${recoveryRoute.export}`,
		);
	}
}
