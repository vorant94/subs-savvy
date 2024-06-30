import { cn } from '@/ui/utils/cn.ts';
import {
  faBolt,
  faCar,
  faCarBurst,
  faCity,
  faDumbbell,
  faEye,
  faHeart,
  faHouse,
  faPeopleGroup,
  faPlaneArrival,
  faPlaneDeparture,
  faTooth,
} from '@fortawesome/free-solid-svg-icons';
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
import Moovit from '../assets/moovit.svg?react';

export const subscriptionIcons = [
  'telegram',
  'netflix',
  'jetbrains',
  'github',
  'youtube',
  'house',
  'headspace',
  'godaddy',
  'moovit',
  'tooth',
  'car',
  'eye',
  'heart',
  'city',
  'plane-departure',
  'plane-arrival',
  'car-burst',
  'dumbbell',
  'bolt',
  'people-group',
] as const;
export type SubscriptionIcon = (typeof subscriptionIcons)[number];

export const subscriptionIconToSvg = {
  telegram: <Telegram className={cn(`fill-[#26A5E4]`)} />,
  netflix: <Netflix className={cn(`fill-[#E50914]`)} />,
  jetbrains: <JetBrains className={cn(`fill-[#000000]`)} />,
  github: <GitHub className={cn(`fill-[#181717]`)} />,
  youtube: <YouTube className={cn(`fill-[#FF0000]`)} />,
  house: (
    <FontAwesomeIcon
      size="2xl"
      icon={faHouse}
      className={cn(`text-slate-800`)}
    />
  ),
  headspace: <HeadSpace className={cn(`fill-[#F47D31]`)} />,
  godaddy: <GoDaddy className={cn(`fill-[#1BDBDB]`)} />,
  moovit: <Moovit className={cn(`fill-[#FF6400]`)} />,
  tooth: (
    <FontAwesomeIcon
      size="2xl"
      icon={faTooth}
      className={cn(`text-slate-800`)}
    />
  ),
  car: (
    <FontAwesomeIcon
      size="2xl"
      icon={faCar}
      className={cn(`text-slate-800`)}
    />
  ),
  eye: (
    <FontAwesomeIcon
      size="2xl"
      icon={faEye}
      className={cn(`text-slate-800`)}
    />
  ),
  heart: (
    <FontAwesomeIcon
      size="2xl"
      icon={faHeart}
      className={cn(`text-slate-800`)}
    />
  ),
  city: (
    <FontAwesomeIcon
      size="2xl"
      icon={faCity}
      className={cn(`text-slate-800`)}
    />
  ),
  'plane-departure': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPlaneDeparture}
      className={cn(`text-slate-800`)}
    />
  ),
  'plane-arrival': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPlaneArrival}
      className={cn(`text-slate-800`)}
    />
  ),
  'car-burst': (
    <FontAwesomeIcon
      size="2xl"
      icon={faCarBurst}
      className={cn(`text-slate-800`)}
    />
  ),
  dumbbell: (
    <FontAwesomeIcon
      size="2xl"
      icon={faDumbbell}
      className={cn(`text-slate-800`)}
    />
  ),
  bolt: (
    <FontAwesomeIcon
      size="2xl"
      icon={faBolt}
      className={cn(`text-slate-800`)}
    />
  ),
  'people-group': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPeopleGroup}
      className={cn(`text-slate-800`)}
    />
  ),
} as const satisfies Record<SubscriptionIcon, ReactElement>;

export const subscriptionIconToLabel = {
  telegram: 'Telegram',
  netflix: 'Netflix',
  jetbrains: 'JetBrains',
  github: 'GitHub',
  youtube: 'YouTube',
  house: 'House',
  headspace: 'HeadSpace',
  godaddy: 'GoDaddy',
  moovit: 'Moovit',
  tooth: 'Tooth',
  car: 'Car',
  eye: 'Eye',
  heart: 'Heart',
  city: 'City',
  'plane-departure': 'Plane Departure',
  'plane-arrival': 'Plane Arrival',
  'car-burst': 'Car Burst',
  dumbbell: 'Dumbbell',
  bolt: 'Bolt',
  'people-group': 'People Group',
} as const satisfies Record<SubscriptionIcon, string>;

export const subscriptionIconsComboboxData: ComboboxData = subscriptionIcons
  .map((icon) => ({
    value: icon,
    label: subscriptionIconToLabel[icon],
  }))
  .toSorted((a, b) => a.label.localeCompare(b.label));
