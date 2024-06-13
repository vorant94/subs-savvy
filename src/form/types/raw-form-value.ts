import type { FormDateFormat } from './form-date-format.ts';

export type RawFormValue<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Date
      ? FormDateFormat | ''
      : RawFormValue<T[K]>
    : T[K] extends string
      ? T[K] | ''
      : string;
};
