import type { Locator } from '@playwright/test';

export class SelectCom<T extends string = string> {
  constructor(
    private readonly locator: Locator,
    private readonly mapValueToLabel: Record<T, string>,
  ) {}

  async fill(value: T): Promise<void> {
    await this.locator.nth(0).click();
    await this.locator
      .nth(1)
      .getByRole('option', { name: this.mapValueToLabel[value] })
      .click();
  }
}
