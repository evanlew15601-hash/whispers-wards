export type EncounterIdFields = {
  kind: 'embargo' | 'raid' | 'skirmish' | 'summit';
  a: string;
  b: string;
  routeId?: string;
  regionId?: string;
};

export const encounterTemplateIdFromCandidate = (c: EncounterIdFields): string => {
  const pair = [c.a, c.b].slice().sort().join('|');
  const location = c.routeId ? `route:${c.routeId}` : c.regionId ? `region:${c.regionId}` : 'none';
  return `${c.kind}:${pair}:${location}`;
};
