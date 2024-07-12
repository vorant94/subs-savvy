import { zodResolver } from '@hookform/resolvers/zod';
import { ColorInput, NumberInput, TextInput } from '@mantine/core';
import { forwardRef, memo } from 'react';
import {
  Controller,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form';
import { cn } from '../../ui/utils/cn.ts';
import {
  insertCategorySchema,
  updateCategorySchema,
  type CategoryModel,
  type UpsertCategoryModel,
} from '../models/category.model.ts';

export const CategoryForm = memo(
  forwardRef<HTMLFormElement, CategoryFormProps>(
    ({ onSubmit, category }, ref) => {
      const {
        register,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<UpsertCategoryModel>({
        resolver: zodResolver(
          category ? updateCategorySchema : insertCategorySchema,
        ),
        defaultValues: category ?? defaultValues,
      });

      return (
        <form
          id="categoryForm"
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
    },
  ),
);

export interface CategoryFormProps {
  onSubmit: SubmitHandler<UpsertCategoryModel>;
  category?: CategoryModel | null;
}

const defaultValues: DefaultValues<UpsertCategoryModel> = {};
