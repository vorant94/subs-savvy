import { recoverySchema } from '@/recovery/models/recovery.model.ts';
import { RecoveryExportPom } from '@/recovery/pages/recovery-export.pom.ts';
import { RecoveryImportPom } from '@/recovery/pages/recovery-import.pom.ts';
import { RecoveryPom } from '@/recovery/pages/recovery.pom.ts';
import { recoveryRoute } from '@/recovery/types/recovery-route.ts';
import { subscriptions } from '@/subscriptions/models/subscription.mock.ts';
import type { SubscriptionModel } from '@/subscriptions/models/subscription.model.ts';
import { rootRoute } from '@/ui/types/root-route.ts';
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

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
    const exportedRecovery = recoverySchema.parse(JSON.parse(recoveryString));

    const areAllSubscriptionsExported = subscriptionsToExport.every(
      (subscriptionToExport) =>
        !!exportedRecovery.subscriptions.find(
          (exportedSubscription) =>
            exportedSubscription.name === subscriptionToExport.name,
        ),
    );
    expect(areAllSubscriptionsExported).toBeTruthy();
  });

  test('should import all subscriptions from a JSON file', async ({ page }) => {
    const pom = new RecoveryImportPom(page);
    const filePathToImport = path.join(
      process.cwd(),
      'e2e/assets/subscriptions.json',
    );
    const recoveryStringToImport = await fs.readFile(filePathToImport, {
      encoding: 'utf-8',
    });
    const recoveryToImport = recoverySchema.parse(
      JSON.parse(recoveryStringToImport),
    );

    await pom.goto();
    const uploadEvent = page.waitForEvent('filechooser');
    await pom.chooseFileButton.click();
    const upload = await uploadEvent;
    await upload.setFiles(filePathToImport);
    await pom.importButton.click();
    const importedSubscriptions = await page.evaluate(
      async () => await window.Dexie.subscriptions.toArray(),
    );

    const areAllSubscriptionsImported = recoveryToImport.subscriptions.every(
      (subscriptionToImport) =>
        !!importedSubscriptions.find(
          (importedSubscription) =>
            importedSubscription.name === subscriptionToImport.name,
        ),
    );
    expect(areAllSubscriptionsImported).toBeTruthy();
  });
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
