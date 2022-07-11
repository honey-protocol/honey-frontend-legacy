import { useContext } from 'react';
import { RefreshContext } from '../contexts/RefreshContext';

export const useRefresh = () => {
  const { fast, slow, refreshAd } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, adRefresh: refreshAd }
}
