import { useContext } from 'react';
import { TipsContext } from '@/ui/tips/tipsContext';

export const useTips = () => useContext(TipsContext);
