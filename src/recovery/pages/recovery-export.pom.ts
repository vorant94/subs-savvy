import type { Locator, Page } from '@playwright/test';
import { CheckboxCom } from '../../ui/components/checkbox.com.ts';

export class RecoveryExportPom {
  recoveryNavLink: Locator;
  exportTab: Locator;
  exportButton: Locator;

  selectAllSubscriptions: CheckboxCom;

  constructor(private readonly page: Page) {
    this.recoveryNavLink = this.page.getByRole('link', {
      name: 'recovery',
    });
    this.exportTab = this.page.getByRole('tab', {
      name: 'export',
    });
    this.exportButton = this.page.getByRole('button', {
      name: 'export',
    });

    this.selectAllSubscriptions = new CheckboxCom(
      this.page.getByLabel('select all subscriptions'),
    );
  }

  async goto() {
    await this.page.goto('/');
    await this.recoveryNavLink.click();
    await this.exportTab.click();
  }
}
