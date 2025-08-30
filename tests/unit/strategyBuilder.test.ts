import { describe, it, expect } from 'vitest';
import { StrategyBuilder } from '../../lib/strategy-builder';

describe('StrategyBuilder', () => {
  it('throws if citation missing', () => {
    const builder = new StrategyBuilder();
    builder.addSection({ title: 'Overview', content: 'Some content' });
    expect(() => builder.build()).toThrow(/citation/i);
  });
});
