import type { Locator, Page } from '@playwright/test';
import { CategorySelectCom } from '../../categories/components/category-select.com.ts';
import { SubscriptionUpsertCom } from '../components/subscription-upsert.com';
import type {
  SubscriptionModel,
  UpsertSubscriptionModel,
} from '../models/subscription.model';

export class SubscriptionsPom {
  addSubscriptionButton: Locator;
  noSubscriptionsPlaceholder: Locator;

  subscriptionUpsert: SubscriptionUpsertCom;

  categorySelect: CategorySelectCom;

  subscriptionsNavLink: Locator;

  constructor(private readonly page: Page) {
    this.addSubscriptionButton = this.page.getByRole('button', {
      name: 'add sub',
    });
    this.noSubscriptionsPlaceholder = this.page.getByText('No Subscriptions');

    this.subscriptionUpsert = new SubscriptionUpsertCom(this.page);

    this.categorySelect = new CategorySelectCom(this.page);

    this.subscriptionsNavLink = this.page.getByRole('link', {
      name: 'subscriptions',
    });
  }

  async goto() {
    await this.page.goto('/');
    await this.subscriptionsNavLink.click();
  }

  subscriptionListItem({
    name,
  }: SubscriptionModel | UpsertSubscriptionModel): Locator {
    return this.page.getByLabel(name);
  }
}
