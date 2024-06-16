import { cn } from '@/ui/utils/cn.ts';
import { NumberInput, TextInput } from '@mantine/core';
import { forwardRef, memo, useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { type TagModel, type UpsertTagModel } from '../models/tag.model.ts';

export const TagForm = memo(
  forwardRef<HTMLFormElement, TagFormProps>(({ onSubmit, tag }, ref) => {
    const { register, handleSubmit, control, reset } =
      useForm<UpsertTagModel>();

    useEffect(() => {
      if (tag) {
        reset(tag);
      }
    }, [reset, tag]);

    return (
      <form
        id="tagForm"
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-2 self-stretch')}>
        <Controller
          control={control}
          name="id"
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberInput
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              className={cn('hidden')}
            />
          )}
        />

        <TextInput
          {...register('name')}
          label="Name"
          placeholder="Name"
          type="text"
          autoComplete="off"
        />

        <TextInput
          {...register('color')}
          label="Color"
          placeholder="Color"
          type="color"
        />
      </form>
    );
  }),
);

export interface TagFormProps {
  onSubmit: SubmitHandler<UpsertTagModel>;
  tag?: TagModel | null;
}
