import { Card, Title } from '@mantine/core';
import { memo } from 'react';
import { cn } from '../../ui/utils/cn.ts';

export const ExpensesByCategory = memo(() => {
  return (
    <Card
      className={cn(`flex h-full flex-col gap-2`)}
      shadow="xs"
      padding="xs"
      radius="md"
      withBorder>
      <Title
        className={cn(`self-center`)}
        order={5}>
        Expenses by Category
      </Title>
    </Card>
  );
});
