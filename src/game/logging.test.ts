import { describe, expect, it } from 'vitest';

import { parseLogLine } from './logging';

describe('parseLogLine', () => {
  it('classifies known prefixes', () => {
    expect(parseLogLine('> Hello').kind).toBe('choice');
    expect(parseLogLine('🌍 World changes').kind).toBe('world');
    expect(parseLogLine('💰 +2 coin').kind).toBe('income');
    expect(parseLogLine('⚡ Event').kind).toBe('event');
    expect(parseLogLine('🔍 Secret').kind).toBe('secret');
    expect(parseLogLine('📌 Project started').kind).toBe('project');
    expect(parseLogLine('⏩ Project accelerated').kind).toBe('project');
    expect(parseLogLine('🛠 Action: X').kind).toBe('action');
    expect(parseLogLine('↩ Returned').kind).toBe('system');
    expect(parseLogLine('⏳ Encounter expired: X').kind).toBe('warning');
    expect(parseLogLine('⚠ Something').kind).toBe('warning');
  });

  it('falls back to other', () => {
    const parsed = parseLogLine('Plain line');
    expect(parsed.kind).toBe('other');
    expect(parsed.text).toBe('Plain line');
  });
});
