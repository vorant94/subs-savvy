import { preprocessNullableValue } from '@/form/utils/preprocess-nullable-value.ts';
import { tagSchema } from '@/tags/models/tag.model.ts';
import { cn } from '@/ui/utils/cn.ts';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import GitHub from 'simple-icons/icons/github.svg?react';
import GoDaddy from 'simple-icons/icons/godaddy.svg?react';
import HeadSpace from 'simple-icons/icons/headspace.svg?react';
import JetBrains from 'simple-icons/icons/jetbrains.svg?react';
import Netflix from 'simple-icons/icons/netflix.svg?react';
import Telegram from 'simple-icons/icons/telegram.svg?react';
import YouTube from 'simple-icons/icons/youtube.svg?react';
import { z } from 'zod';

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
      color="#000000"
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

export const subscriptionCyclePeriods = ['monthly', 'yearly'] as const;
export type SubscriptionCyclePeriod = (typeof subscriptionCyclePeriods)[number];

export const subscriptionCyclePeriodToLabel = {
  monthly: 'Month',
  yearly: 'Year',
} as const satisfies Record<SubscriptionCyclePeriod, string>;

export const subscriptionSchema = z.object({
  // Coercion is needed because <input/> with type="number" still returns string as a value
  id: z.coerce.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  icon: z.enum(subscriptionIcons),
  price: z.coerce.number(),
  startedAt: z.coerce.date(),
  // Preprocessing is needed because <input/> with type="date" returns empty string as a value and it is not a valid date
  endedAt: z.preprocess(
    preprocessNullableValue,
    z.coerce.date().nullable().optional(),
  ),
  cycle: z.object({
    each: z.coerce.number(),
    period: z.enum(subscriptionCyclePeriods),
  }),
  tags: z.array(tagSchema),
});
export type SubscriptionModel = z.infer<typeof subscriptionSchema>;

export const insertSubscriptionSchema = subscriptionSchema.omit({
  id: true,
});
export type InsertSubscriptionModel = z.infer<typeof insertSubscriptionSchema>;

export const updateSubscriptionSchema = subscriptionSchema.omit({});
export type UpdateSubscriptionModel = z.infer<typeof updateSubscriptionSchema>;

export type UpsertSubscriptionModel =
  | InsertSubscriptionModel
  | UpdateSubscriptionModel;
