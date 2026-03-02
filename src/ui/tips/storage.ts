export interface TipSettings {
  enabled: boolean;
}

export const DEFAULT_TIP_SETTINGS: TipSettings = {
  enabled: true,
};

const STORAGE_KEY = 'crown-concord.tips.v1';

export const loadTipSettings = (): TipSettings => {
  if (typeof localStorage === 'undefined') return DEFAULT_TIP_SETTINGS;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_TIP_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<TipSettings>;

    return {
      enabled: parsed.enabled ?? DEFAULT_TIP_SETTINGS.enabled,
    };
  } catch {
    return DEFAULT_TIP_SETTINGS;
  }
};

export const saveTipSettings = (settings: TipSettings) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
