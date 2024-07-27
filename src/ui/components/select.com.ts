import type { Locator } from "@playwright/test";

export class SelectCom<T extends string = string> {
	readonly #locator: Locator;
	readonly #mapValueToLabel?: Record<T, string>;

	constructor(locator: Locator, mapValueToLabel?: Record<T, string>) {
		this.#locator = locator;
		this.#mapValueToLabel = mapValueToLabel;
	}

	async fillWithValue(value: T): Promise<void> {
		await this.#locator.nth(0).click();

		if (!this.#mapValueToLabel || !this.#mapValueToLabel[value]) {
			throw new Error(`No label is associated with value ${value}`);
		}

		await this.#locator
			.nth(1)
			.getByRole("option", { name: this.#mapValueToLabel[value] })
			.click();
	}

	async fillWithLabel(label: string): Promise<void> {
		await this.#locator.nth(0).click();
		await this.#locator.nth(1).getByRole("option", { name: label }).click();
	}
}
