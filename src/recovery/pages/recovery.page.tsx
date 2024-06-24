import { route } from '@/router/types/route.ts';
import {
  DefaultLayout,
  DefaultLayoutHeader,
} from '@/ui/layouts/default.layout.tsx';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Tabs } from '@mantine/core';
import { memo, useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { recoveryRoute } from '../types/recovery-route.ts';

export const RecoveryPage = memo(() => {
  const { pathname } = useLocation();
  const activeTab = useMemo(() => {
    return pathname.split('/').at(-1);
  }, [pathname]);

  const navigate = useNavigate();
  const navigateToTab = useCallback(
    (tab: string | null) => navigate(`/${route.recovery}/${tab}`),
    [navigate],
  );

  return (
    <DefaultLayout header={<DefaultLayoutHeader />}>
      <Card
        shadow="xs"
        padding="xs"
        radius="md"
        withBorder>
        <Tabs
          value={activeTab}
          onChange={navigateToTab}>
          <Tabs.List>
            <Tabs.Tab
              value={recoveryRoute.import}
              leftSection={<FontAwesomeIcon icon={faUpload} />}>
              Import
            </Tabs.Tab>
            <Tabs.Tab
              value={recoveryRoute.export}
              leftSection={<FontAwesomeIcon icon={faDownload} />}>
              Export
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Outlet />
      </Card>
    </DefaultLayout>
  );
});
