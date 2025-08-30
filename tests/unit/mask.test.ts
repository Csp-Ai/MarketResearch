import { describe, it, expect } from 'vitest';
import { mask } from '../../lib/privacy/mask';

describe('mask', () => {
  it('masks middle section by default', () => {
    expect(mask('1234567890')).toBe('1234**7890');
  });

  it('returns empty string for empty input', () => {
    expect(mask('')).toBe('');
  });

  it('masks entire string when too short', () => {
    expect(mask('123456', { visible: 4 })).toBe('******');
  });

  it('supports custom mask char and visible count', () => {
    expect(mask('abcdefghij', { visible: 2, maskChar: '#' })).toBe('ab######ij');
  });

  it('handles zero visible characters', () => {
    expect(mask('secret', { visible: 0 })).toBe('******');
  });
});
