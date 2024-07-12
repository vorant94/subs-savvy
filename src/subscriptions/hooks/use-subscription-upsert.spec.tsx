import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import type { FC, PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DefaultLayoutProvider,
  useDefaultLayout,
  type UseDefaultLayout,
} from '../../ui/hooks/use-default-layout.tsx';
import {
  SubscriptionUpsertProvider,
  useSubscriptionUpsert,
  type UseSubscriptionUpsert,
} from './use-subscription-upsert.tsx';

describe('useSubscriptionUpsert', () => {
  let renderResult: RenderHookResult<HooksCombined, void>;
  let hooks: RenderHookResult<HooksCombined, void>['result'];

  beforeEach(() => {
    renderResult = renderHook<HooksCombined, void>(
      () => ({
        upsert: useSubscriptionUpsert(),
        defaultLayout: useDefaultLayout(),
      }),
      {
        wrapper,
      },
    );

    hooks = renderResult.result;
  });

  it('should open/close drawer on upsert open/close', () => {
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeFalsy();
    expect(hooks.current.upsert.state.mode).toBeFalsy();

    act(() => hooks.current.upsert.dispatch({ type: 'open' }));
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeTruthy();

    act(() => hooks.current.upsert.dispatch({ type: 'close' }));
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeFalsy();
  });

  it('should close upsert on drawer close', () => {
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeFalsy();
    expect(hooks.current.upsert.state.mode).toBeFalsy();

    act(() => hooks.current.upsert.dispatch({ type: 'open' }));
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeTruthy();

    act(() => hooks.current.defaultLayout.drawer.close());
    expect(hooks.current.upsert.state.mode).toBeFalsy();
  });

  it(`shouldn't open upsert on drawer open`, () => {
    expect(hooks.current.defaultLayout.isDrawerOpened).toBeFalsy();
    expect(hooks.current.upsert.state.mode).toBeFalsy();

    act(() => hooks.current.defaultLayout.drawer.open());
    expect(hooks.current.upsert.state.mode).toBeFalsy();
  });
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BrowserRouter>
      <DefaultLayoutProvider>
        <SubscriptionUpsertProvider>{children}</SubscriptionUpsertProvider>
      </DefaultLayoutProvider>
    </BrowserRouter>
  );
};

interface HooksCombined {
  upsert: UseSubscriptionUpsert;
  defaultLayout: UseDefaultLayout;
}
