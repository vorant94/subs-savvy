import { cn } from '@/ui/utils/cn.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColorInput, NumberInput, TextInput } from '@mantine/core';
import { forwardRef, memo } from 'react';
import {
  Controller,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form';
import {
  insertTagSchema,
  updateTagSchema,
  type TagModel,
  type UpsertTagModel,
} from '../models/tag.model.ts';

export const TagForm = memo(
  forwardRef<HTMLFormElement, TagFormProps>(({ onSubmit, tag }, ref) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<UpsertTagModel>({
      resolver: zodResolver(tag ? updateTagSchema : insertTagSchema),
      defaultValues: tag ?? defaultValues,
    });

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
          error={errors.name?.message}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, onBlur, value } }) => (
            <ColorInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              label="Color"
              placeholder="Color"
              error={errors.color?.message}
            />
          )}
        />
      </form>
    );
  }),
);

export interface TagFormProps {
  onSubmit: SubmitHandler<UpsertTagModel>;
  tag?: TagModel | null;
}

const defaultValues: DefaultValues<UpsertTagModel> = {};
