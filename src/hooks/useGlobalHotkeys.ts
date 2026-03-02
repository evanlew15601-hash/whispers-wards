import { useEffect } from 'react';

export type GlobalHotkeyBinding = {
  keys: string[];
  handler: (event: KeyboardEvent) => void;
  enabled?: boolean;
};

type RegisteredBinding = {
  id: number;
  keys: Set<string>;
  handler: (event: KeyboardEvent) => void;
  enabled: boolean;
  order: number;
};

let nextId = 1;
let nextOrder = 1;
const bindings = new Map<number, RegisteredBinding>();
let listenerAttached = false;

const isUserTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

  return el.isContentEditable;
};

const isModalOpen = () => {
  const openByState = document.querySelector(
    '[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"]',
  );
  if (openByState) return true;

  const openByAria = document.querySelector('[role="dialog"][aria-modal="true"],[role="alertdialog"][aria-modal="true"]');
  if (openByAria) return true;

  // Fallback: if a dialog is present without state markers, assume it is modal.
  const anyDialog = document.querySelector(
    '[role="dialog"]:not([data-state="closed"]):not([hidden]),[role="alertdialog"]:not([data-state="closed"]):not([hidden])',
  );
  return Boolean(anyDialog);
};

const normalizeKey = (event: KeyboardEvent) => {
  const k = event.key?.toLowerCase();
  if (!k) return null;
  if (k === ' ') return 'space';
  return k;
};

const toCombos = (event: KeyboardEvent): string[] => {
  const key = normalizeKey(event);
  if (!key) return [];

  const mod = event.ctrlKey || event.metaKey;

  // Prefer mod+key combos first.
  const combos: string[] = [];
  if (mod) combos.push(`mod+${key}`);
  combos.push(key);

  return combos;
};

const ensureListener = () => {
  if (listenerAttached) return;
  listenerAttached = true;

  window.addEventListener(
    'keydown',
    event => {
      if (event.defaultPrevented) return;
      if (isUserTyping()) return;
      if (isModalOpen()) return;

      const combos = toCombos(event);
      if (!combos.length) return;

      const active = [...bindings.values()]
        .filter(b => b.enabled)
        .sort((a, b) => b.order - a.order);

      for (const binding of active) {
        if (!combos.some(c => binding.keys.has(c))) continue;

        binding.handler(event);
        if (event.defaultPrevented) return;
      }
    },
    true,
  );
};

const registerBindings = (list: GlobalHotkeyBinding[]) => {
  ensureListener();

  const ids: number[] = [];
  for (const b of list) {
    const id = nextId++;
    ids.push(id);

    bindings.set(id, {
      id,
      keys: new Set(b.keys.map(k => k.toLowerCase())),
      handler: b.handler,
      enabled: b.enabled ?? true,
      order: nextOrder++,
    });
  }

  return () => {
    for (const id of ids) bindings.delete(id);
  };
};

export const useGlobalHotkeys = (list: GlobalHotkeyBinding[]) => {
  useEffect(() => {
    const unregister = registerBindings(list);
    return unregister;
  }, [list]);
};
