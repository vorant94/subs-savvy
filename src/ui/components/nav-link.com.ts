import type { Locator } from '@playwright/test';

export class NavLinkCom {
  constructor(private readonly locator: Locator) {}

  async click(): Promise<void> {
    await this.locator.click();
  }
}
