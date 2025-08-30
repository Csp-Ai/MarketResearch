export interface MaskOptions {
  visible?: number;
  maskChar?: string;
}

/**
 * Masks a string by preserving the first and last `visible` characters
 * and replacing the middle with the `maskChar`.
 * If the input is shorter than `visible * 2`, the entire string is masked.
 */
export function mask(value: string, opts: MaskOptions = {}): string {
  const { visible = 4, maskChar = '*' } = opts;
  if (!value) return '';
  if (visible <= 0) return maskChar.repeat(value.length);
  if (value.length <= visible * 2) return maskChar.repeat(value.length);
  const start = value.slice(0, visible);
  const end = value.slice(-visible);
  return start + maskChar.repeat(value.length - visible * 2) + end;
}
