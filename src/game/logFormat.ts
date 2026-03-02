export const formatLogChoice = (text: string) => `> ${text}`;

export const formatLogEndTurn = () => '⏭ End Turn';

export const formatLogWorldEvent = (text: string) => `🌍 ${text}`;

export const formatLogIncome = (text: string) => `💰 ${text}`;

export const formatLogCrisisExpired = (title: string, tensionDelta: number) =>
  `⏳ Encounter expired: ${title} (+${tensionDelta} tension)`;

export const formatLogReturnedToHall = () => '↩ Returned to Concord Hall';

export const formatLogLeftHallWithCrisis = (title: string) => `⚠ Left Hall with crisis pending: ${title}`;
