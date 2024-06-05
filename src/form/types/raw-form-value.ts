export type RawFormValue<T> = {
  [K in keyof T]: string;
};
