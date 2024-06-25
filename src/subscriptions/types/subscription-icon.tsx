import { cn } from '@/ui/utils/cn.ts';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ComboboxData } from '@mantine/core';
import type { ReactElement } from 'react';
import GitHub from 'simple-icons/icons/github.svg?react';
import GoDaddy from 'simple-icons/icons/godaddy.svg?react';
import HeadSpace from 'simple-icons/icons/headspace.svg?react';
import JetBrains from 'simple-icons/icons/jetbrains.svg?react';
import Netflix from 'simple-icons/icons/netflix.svg?react';
import Telegram from 'simple-icons/icons/telegram.svg?react';
import YouTube from 'simple-icons/icons/youtube.svg?react';

export const subscriptionIcons = [
  'telegram',
  'netflix',
  'jetbrains',
  'github',
  'youtube',
  'home',
  'headspace',
  'godaddy',
] as const;
export type SubscriptionIcon = (typeof subscriptionIcons)[number];

export const subscriptionIconToSvg = {
  telegram: <Telegram className={cn(`fill-[#26A5E4]`)} />,
  netflix: <Netflix className={cn(`fill-[#E50914]`)} />,
  jetbrains: <JetBrains className={cn(`fill-[#000000]`)} />,
  github: <GitHub className={cn(`fill-[#181717]`)} />,
  youtube: <YouTube className={cn(`fill-[#FF0000]`)} />,
  home: (
    <FontAwesomeIcon
      size="2xl"
      icon={faHouse}
      className={cn(`text-slate-800`)}
    />
  ),
  headspace: <HeadSpace className={cn(`fill-[#F47D31]`)} />,
  godaddy: <GoDaddy className={cn(`fill-[#1BDBDB]`)} />,
} as const satisfies Record<SubscriptionIcon, ReactElement>;

export const subscriptionIconToLabel = {
  telegram: 'Telegram',
  netflix: 'Netflix',
  jetbrains: 'JetBrains',
  github: 'GitHub',
  youtube: 'YouTube',
  home: 'Home',
  headspace: 'HeadSpace',
  godaddy: 'GoDaddy',
} as const satisfies Record<SubscriptionIcon, string>;

export const subscriptionIconsComboboxData: ComboboxData =
  subscriptionIcons.map((icon) => ({
    value: icon,
    label: subscriptionIconToLabel[icon],
  }));
