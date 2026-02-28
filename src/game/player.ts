import type { PlayerProfile } from '@/game/types';
import { isPortraitId, playerPortraitIds } from '@/game/portraitIds';

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  name: 'Envoy',
  pronouns: 'they/them',
  portraitId: 'envoy-default',
};

export function normalizePlayerProfile(input: unknown): PlayerProfile {
  const candidate = (input ?? {}) as Partial<PlayerProfile>;

  const nameRaw = typeof candidate.name === 'string' ? candidate.name : '';
  const name = nameRaw.trim() || DEFAULT_PLAYER_PROFILE.name;

  const pronouns =
    candidate.pronouns === 'they/them' || candidate.pronouns === 'she/her' || candidate.pronouns === 'he/him'
      ? candidate.pronouns
      : DEFAULT_PLAYER_PROFILE.pronouns;

  const portraitIdRaw = typeof candidate.portraitId === 'string' ? candidate.portraitId : '';
  const fallbackPortraitId = playerPortraitIds[0] ?? DEFAULT_PLAYER_PROFILE.portraitId;

  const portraitId = isPortraitId(portraitIdRaw) ? portraitIdRaw : fallbackPortraitId;

  return {
    name,
    pronouns,
    portraitId,
  };
}
