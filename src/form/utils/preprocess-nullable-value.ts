export function preprocessNullableValue<T = unknown>(value: T): T | null {
  return value === '' ? null : value;
}
