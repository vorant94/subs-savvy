import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import type { TagModel, UpsertTagModel } from '@/tags/models/tag.model.ts';
import { cn } from '@/ui/utils/cn.ts';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { forwardRef, memo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export const TagForm = memo(
  forwardRef<HTMLFormElement, TagFormProps>(({ onSubmit, tag }, ref) => {
    const { register, handleSubmit, reset } =
      useForm<RawFormValue<UpsertTagModel>>();

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
        <input
          {...register('id')}
          id="id"
          type="number"
          className={cn('hidden')}
        />

        <FormControl>
          <FormLabel>
            Name
            <Input
              {...register('name', { required: true })}
              placeholder="Name"
              type="text"
              autoComplete="off"
            />
          </FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel>
            Color
            <Input
              {...register('color', { required: true })}
              placeholder="Color"
              type="color"
            />
          </FormLabel>
        </FormControl>
      </form>
    );
  }),
);

export interface TagFormProps {
  onSubmit: SubmitHandler<RawFormValue<UpsertTagModel>>;
  tag?: TagModel | null;
}
