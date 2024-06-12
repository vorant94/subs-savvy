import { preprocessNullableValue } from '@/form/utils/preprocess-nullable-value.ts';
import { cn } from '@/ui/utils/cn.ts';
import type { ReactElement } from 'react';
import GitHub from 'simple-icons/icons/github.svg?react';
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
] as const;
export type SubscriptionIcon = (typeof subscriptionIcons)[number];

export const subscriptionSchema = z.object({
  // Coercion is needed because <input/> with type="number" still returns string as a value
  id: z.coerce.number(),
  name: z.string().min(1),
  price: z.coerce.number(),
  icon: z.enum(subscriptionIcons),
  description: z.string().nullable().optional(),
  // Preprocessing is needed because <input/> with type="date" returns empty string as a value and it is not a valid date
  startedAt: z.preprocess(
    preprocessNullableValue,
    z.coerce.date().nullable().optional(),
  ),
  endedAt: z.preprocess(
    preprocessNullableValue,
    z.coerce.date().nullable().optional(),
  ),
});
export type SubscriptionModel = z.infer<typeof subscriptionSchema>;

export const insertSubscriptionSchema = subscriptionSchema.omit({ id: true });
export type InsertSubscriptionModel = z.infer<typeof insertSubscriptionSchema>;

export const updateSubscriptionSchema = subscriptionSchema;
export type UpdateSubscriptionModel = z.infer<typeof updateSubscriptionSchema>;

export type UpsertSubscriptionModel =
  | InsertSubscriptionModel
  | UpdateSubscriptionModel;

export const subscriptionIconToIconElement = {
  telegram: <Telegram className={cn(`fill-[#26A5E4]`)} />,
  netflix: <Netflix className={cn(`fill-[#E50914]`)} />,
  jetbrains: <JetBrains className={cn(`fill-[#000000]`)} />,
  github: <GitHub className={cn(`fill-[#181717]`)} />,
  youtube: <YouTube className={cn(`fill-[#FF0000]`)} />,
} as const satisfies Record<SubscriptionIcon, ReactElement>;

export const subscriptionIconToLabel = {
  telegram: 'Telegram',
  netflix: 'Netflix',
  jetbrains: 'JetBrains',
  github: 'GitHub',
  youtube: 'YouTube',
} as const satisfies Record<SubscriptionIcon, string>;
