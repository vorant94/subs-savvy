import { recoverySchema } from '@/recovery/models/recovery.model.ts';
import { RecoveryExportPom } from '@/recovery/pages/recovery-export.pom.tsx';
import { RecoveryPom } from '@/recovery/pages/recovery.pom.tsx';
import { recoveryRoute } from '@/recovery/types/recovery-route.ts';
import { subscriptions } from '@/subscriptions/models/subscription.mock.ts';
import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import { rootRoute } from '@/ui/types/root-route.ts';
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';

test.describe('recovery', () => {
  test('should redirect from recovery url to recovery import', async ({
    page,
  }) => {
    const pom = new RecoveryPom(page);

    await pom.goto();

    await expect(page).toHaveURL(
      `/${rootRoute.recovery}/${recoveryRoute.import}`,
    );
  });

  test('should export all subscriptions as a JSON file', async ({ page }) => {
    const pom = new RecoveryExportPom(page);
    const subscriptionsToExport = subscriptions;

    await pom.goto();
    await populateDb(page, subscriptionsToExport);

    await pom.selectAllSubscriptions.fill(true);
    const downloadEvent = page.waitForEvent('download');
    await pom.exportButton.click();
    const download = await downloadEvent;
    const recoveryString = await fs.readFile(await download.path(), {
      encoding: 'utf-8',
    });
    const recovery = recoverySchema.parse(JSON.parse(recoveryString));

    const areAllSubscriptionsExported = subscriptionsToExport.every(
      (subscriptionToExport) =>
        !!recovery.subscriptions.find(
          (recoverySubscription) =>
            recoverySubscription.name === subscriptionToExport.name,
        ),
    );
    expect(areAllSubscriptionsExported).toBeTruthy();
  });

  test.fixme('should import all subscriptions from a JSON file', () => {});
});

async function populateDb(
  page: Page,
  subscriptions: ReadonlyArray<SubscriptionModel>,
): Promise<void> {
  await page.evaluate(async (subscriptions) => {
    await window.Dexie.transaction(
      'rw',
      window.Dexie.subscriptionsTags,
      window.Dexie.subscriptions,
      window.Dexie.tags,
      async () => {
        for (const { tags, ...subscription } of subscriptions) {
          const tagPuts = tags.map((tag) => window.Dexie.tags.put(tag));
          const tagLinkPuts = tags.map((tag) =>
            window.Dexie.subscriptionsTags.put({
              tagId: tag.id,
              subscriptionId: subscription.id,
            }),
          );

          await Promise.all([
            ...tagPuts,
            window.Dexie.subscriptions.put(subscription),
            ...tagLinkPuts,
          ]);
        }
      },
    );
  }, subscriptions);
}
