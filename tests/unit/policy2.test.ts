import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluate, saveRules, loadRules, Rule } from '../../lib/policy2';

describe('policy2 evaluate', () => {
  it('applies built-in matchers', () => {
    const rules: Rule[] = [
      { id: '1', scope: {}, matcher: 'email', action: 'mask', severity: 'low', explain: '' },
    ];
    const res = evaluate('contact test@example.com', rules);
    expect(res.violations.length).toBe(1);
    expect(res.masked).toBe('contact ***');
  });

  it('handles invalid custom regex gracefully', () => {
    const rules: Rule[] = [
      { id: '1', scope: {}, matcher: 'custom', customRegex: '[', action: 'mask', severity: 'low', explain: '' },
    ];
    const res = evaluate('foo', rules);
    expect(res.violations.length).toBe(0);
    expect(res.masked).toBe('foo');
  });
});

describe('policy2 storage', () => {
  const store: Record<string, string> = {};
  const key = 'policy2.rules';
  beforeEach(() => {
    for (const k in store) delete store[k];
    (globalThis as any).window = { dispatchEvent: vi.fn() };
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { for (const k in store) delete store[k]; },
    };
  });

  it('saves and loads rules', () => {
    const rules: Rule[] = [
      { id: '1', scope: {}, matcher: 'email', action: 'mask', severity: 'low', explain: '' },
    ];
    saveRules(rules);
    const loaded = loadRules();
    expect(loaded.length).toBe(1);
  });

  it('handles invalid JSON', () => {
    store[key] = 'not json';
    const loaded = loadRules();
    expect(loaded).toEqual([]);
  });
});
