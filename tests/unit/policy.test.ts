import { describe, it, expect } from 'vitest';
import { evaluate, Policy } from '../../lib/policy';

describe('policy evaluate', () => {
  const policy: Policy = { id: 1, name: 'default', rules: [] };

  it('allows text without entities', () => {
    const res = evaluate('hello world', policy);
    expect(res.action).toBe('ALLOW');
    expect(res.entities.length).toBe(0);
  });

  it('masks text with entities', () => {
    const res = evaluate('email me at test@example.com', policy);
    expect(res.action).toBe('MASK');
    expect(res.entities[0].type).toBe('EMAIL');
  });
});
