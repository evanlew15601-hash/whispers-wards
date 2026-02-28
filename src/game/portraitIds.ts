export type PortraitId = 'envoy-default' | 'envoy-alternate' | 'envoy-shadow';

export const playerPortraitIds: PortraitId[] = ['envoy-default', 'envoy-alternate', 'envoy-shadow'];

export function isPortraitId(id: string): id is PortraitId {
  return (playerPortraitIds as readonly string[]).includes(id);
}
