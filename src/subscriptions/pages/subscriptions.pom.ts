import { TagFormCom } from '@/tags/components/tag-form.com';
import type { TagModel, UpsertTagModel } from '@/tags/models/tag.model';
import type { Locator, Page } from '@playwright/test';
import { SubscriptionUpsertCom } from '../components/subscription-upsert.com';
import type {
  SubscriptionModel,
  UpsertSubscriptionModel,
} from '../models/subscription.model';

export class SubscriptionsPom {
  addSubscriptionButton: Locator;
  noSubscriptionsPlaceholder: Locator;

  subscriptionUpsert: SubscriptionUpsertCom;

  manageTagsButton: Locator;
  addTagButton: Locator;
  insertTagButton: Locator;
  updateTagButton: Locator;

  tagForm: TagFormCom;

  subscriptionsNavLink: Locator;

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

  async fillSubscriptionUpsert(
    subscription: UpsertSubscriptionModel,
  ): Promise<void> {
    await this.subscriptionUpsert.nameControl.fill(subscription.name);

    if (subscription.description) {
      await this.subscriptionUpsert.descriptionControl.fill(
        subscription.description,
      );
    }

    await this.subscriptionUpsert.iconControl.fill(subscription.icon);
    await this.subscriptionUpsert.priceControl.fill(subscription.price);
    await this.subscriptionUpsert.startedAtControl.fill(subscription.startedAt);

    if (subscription.endedAt) {
      await this.subscriptionUpsert.endedAtControl.fill(subscription.endedAt);
    }

    await this.subscriptionUpsert.eachControl.fill(subscription.cycle.each);
    await this.subscriptionUpsert.periodControl.fill(subscription.cycle.period);

    // TODO: add filling tag multiselect here
  }

  async fillTagForm(tag: UpsertTagModel): Promise<void> {
    await this.tagForm.nameControl.fill(tag.name);
    await this.tagForm.colorControl.fill(tag.color);
  }

  subscriptionListItem({
    name,
  }: SubscriptionModel | UpsertSubscriptionModel): Locator {
    return this.page.getByLabel(name);
  }

  tag({ name }: TagModel | UpsertTagModel): Locator {
    return this.page.getByRole('paragraph').filter({ hasText: name });
  }

  editTagButton({ name }: TagModel | UpsertTagModel): Locator {
    return this.page.getByRole('button', { name: `edit ${name} tag` });
  }

  deleteTagButton({ name }: TagModel | UpsertTagModel): Locator {
    return this.page.getByRole('button', { name: `delete ${name} tag` });
  }
}
