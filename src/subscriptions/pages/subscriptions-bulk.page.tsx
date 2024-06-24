import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from '@mantine/core';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExportSubscriptions } from '../components/export-subscriptions';

export const SubscriptionsBulkPage = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = useMemo(() => {
    const tabFromSearchParams = searchParams.get(tabSearchParam);
    if (!tabFromSearchParams || !(tabFromSearchParams in bulkTab)) {
      return bulkTab.import;
    }

    return tabFromSearchParams as BulkTab;
  }, [searchParams]);

  const changeTab = useCallback(
    (newTab: string | null) => {
      if (!newTab || !(newTab in bulkTab)) {
        setSearchParams((prevSearchParams) => {
          prevSearchParams.set(tabSearchParam, bulkTab.import);
          return prevSearchParams;
        });
      }

      setSearchParams((prevSearchParams) => {
        prevSearchParams.set(tabSearchParam, bulkTab[newTab as BulkTab]);
        return prevSearchParams;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const tabFromSearchParams = searchParams.get(tabSearchParam);
    if (tabFromSearchParams && !(tabFromSearchParams in bulkTab)) {
      setSearchParams((prevSearchParams) => {
        prevSearchParams.delete(tabSearchParam);
        return prevSearchParams;
      });
    }
  }, [searchParams, setSearchParams]);

  return (
    <DefaultLayout header={<DefaultLayoutHeader />}>
      <Tabs
        value={tab}
        onChange={changeTab}>
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
        <Tabs.Panel value={bulkTab.export}>
          <ExportSubscriptions />
        </Tabs.Panel>
      </Tabs>
    </DefaultLayout>
  );
});

const bulkTab = {
  import: 'import',
  export: 'export',
} as const;
type BulkTab = (typeof bulkTab)[keyof typeof bulkTab];

const tabSearchParam = 'tab';
