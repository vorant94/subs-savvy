import { TagFormCom } from '@/tags/components/tag-form.com';
import type { Locator, Page } from '@playwright/test';
import { SubscriptionUpsertCom } from '../components/subscription-upsert.com';

export class SubscriptionsPom {
  addSubscriptionButton: Locator;
  noSubscriptionsPlaceholder: Locator;

  subscriptionUpsert: SubscriptionUpsertCom;

  manageTagsButton: Locator;
  addTagButton: Locator;
  insertTagButton: Locator;
  updateTagButton: Locator;

  tagForm: TagFormCom;

  private subscriptionsNavLink: Locator;

  constructor(private readonly page: Page) {
    this.addSubscriptionButton = this.page.getByRole('button', {
      name: 'add sub',
    });
    this.noSubscriptionsPlaceholder = this.page.getByText('No Subscriptions');

    this.subscriptionUpsert = new SubscriptionUpsertCom(this.page);

    this.manageTagsButton = page.getByRole('button', { name: 'manage' });
    this.addTagButton = page.getByRole('button', { name: 'add tag' });
    this.insertTagButton = this.page.getByRole('button', {
      name: 'insert',
    });
    this.updateTagButton = this.page.getByRole('button', {
      name: 'update',
    });

    this.tagForm = new TagFormCom(this.page);

    this.subscriptionsNavLink = this.page.getByRole('link', {
      name: 'subscriptions',
    });
  }

  async goto() {
    await this.page.goto('/');
    await this.subscriptionsNavLink.click();
  }
}
