import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from '@mantine/core';
import { memo } from 'react';

export const SubscriptionsBulkPage = memo(() => {
  return (
    <DefaultLayout header={<DefaultLayoutHeader />}>
      <Tabs defaultValue={bulkTab.import}>
        <Tabs.List>
          <Tabs.Tab
            value={bulkTab.import}
            leftSection={<FontAwesomeIcon icon={faUpload} />}>
            Import
          </Tabs.Tab>
          <Tabs.Tab
            value={bulkTab.export}
            leftSection={<FontAwesomeIcon icon={faDownload} />}>
            Export
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={bulkTab.import}>Import Content</Tabs.Panel>
        <Tabs.Panel value={bulkTab.export}>Export Content</Tabs.Panel>
      </Tabs>
    </DefaultLayout>
  );
});

const bulkTab = {
  import: 'import',
  export: 'export',
} as const;
