export type UiLogKind =
  | 'choice'
  | 'world'
  | 'income'
  | 'event'
  | 'secret'
  | 'system'
  | 'action'
  | 'project'
  | 'warning'
  | 'other';

export type UiLogEntry = {
  kind: UiLogKind;
  text: string;
  raw: string;
};

export const parseLogLine = (raw: string): UiLogEntry => {
  const trimmed = raw.trimEnd();

  if (trimmed.startsWith('> ')) return { kind: 'choice', text: trimmed.slice(2), raw };
  if (trimmed.startsWith('🌍 ')) return { kind: 'world', text: trimmed.slice(2), raw };
  if (trimmed.startsWith('💰 ')) return { kind: 'income', text: trimmed.slice(2), raw };
  if (trimmed.startsWith('⚡ ')) return { kind: 'event', text: trimmed.slice(2), raw };
  if (trimmed.startsWith('🔍 ')) return { kind: 'secret', text: trimmed.slice(2), raw };

  if (trimmed.startsWith('📌 ') || trimmed.startsWith('⏩ ')) {
    return { kind: 'project', text: trimmed.slice(2), raw };
  }

  if (trimmed.startsWith('🛠 ') || trimmed.startsWith('🛡 ')) {
    return { kind: 'action', text: trimmed.slice(2), raw };
  }

  if (trimmed.startsWith('⏭ ') || trimmed.startsWith('↩ ')) {
    return { kind: 'system', text: trimmed.slice(2), raw };
  }

  if (trimmed.startsWith('⏳ ')) {
    return { kind: 'warning', text: trimmed.slice(2), raw };
  }

  if (trimmed.startsWith('⚠ ')) {
    return { kind: 'warning', text: trimmed.slice(2), raw };
  }

  return { kind: 'other', text: trimmed, raw };
};
