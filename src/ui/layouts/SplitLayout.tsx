import { cn } from '@/ui/utils/cn.ts';
import { type FC, type ReactElement } from 'react';

export const SplitLayout: FC<SplitLayoutProps> = function ({
  header,
  left,
  right,
}) {
  return (
    <div className={cn(`flex flex-col min-h-dvh gap-4`)}>
      {header}
      <div className={cn(`flex-1 flex flex-row gap-4`)}>
        <div className={cn(`flex-1 bg-blue-500`)}>{left}</div>
        {right ? (
          <div className={cn(`flex-1 bg-green-500`)}>{right}</div>
        ) : null}
      </div>
    </div>
  );
};

export interface SplitLayoutProps {
  header: ReactElement<ReturnType<typeof SplitLayoutHeader>>;
  left: ReactElement;
  right?: ReactElement | null;
}

export const SplitLayoutHeader: FC<SplitLayoutHeaderProps> = function ({
  actions,
}) {
  return (
    <header className={cn(`flex flex-row items-center bg-red-500 h-16 px-8`)}>
      <div className={cn(`flex-1`)}></div>
      {actions ? actions : null}
    </header>
  );
};

export interface SplitLayoutHeaderProps {
  actions?: ReactElement;
}
