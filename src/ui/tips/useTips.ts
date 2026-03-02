import { useContext } from 'react';
import { TipsContext } from '@/ui/tips/TipsProvider';

export const useTips = () => useContext(TipsContext);
