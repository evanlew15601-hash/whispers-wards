import type { WorldState } from '../types';

export const BASE_INCOME = {
  coin: 1,
  influence: 1,
  supplies: 1,
  intel: 0,
};

export type DeterministicIncome = {
  openRoutes: number;
  embargoedRoutes: number;
  raidedRoutes: number;
  blockedRoutes: number;
  coinIncome: number;
};

export const computeDeterministicIncome = (world: WorldState): DeterministicIncome => {
  const routes = Object.values(world.tradeRoutes);
  const openRoutes = routes.filter(r => r.status === 'open').length;
  const embargoedRoutes = routes.filter(r => r.status === 'embargoed').length;
  const raidedRoutes = routes.filter(r => r.status === 'raided').length;
  const blockedRoutes = embargoedRoutes + raidedRoutes;

  const coinIncome = Math.max(0, BASE_INCOME.coin + openRoutes - blockedRoutes);

  return {
    openRoutes,
    embargoedRoutes,
    raidedRoutes,
    blockedRoutes,
    coinIncome,
  };
};
