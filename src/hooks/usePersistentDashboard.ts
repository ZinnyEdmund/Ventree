// hooks/usePersistentDashboard.ts
import { useEffect } from 'react';
import { useGetShopDashboardQuery } from '../services/shop.service';
import { TimePeriod } from '../types/general';

export const usePersistentDashboard = (shopId: string, period: TimePeriod) => {
  const cacheKey = `dashboard-${shopId}-${period}`;
  
  const queryResult = useGetShopDashboardQuery(
    { shopId, period },
    { skip: !shopId }
  );

  // Save to localStorage when data changes
  useEffect(() => {
    if (queryResult.data) {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: queryResult.data,
        timestamp: Date.now(),
      }));
    }
  }, [queryResult.data, cacheKey]);

  // Load from localStorage if no data yet
  const cachedData = !queryResult.data && localStorage.getItem(cacheKey);
  const parsedCache = cachedData ? JSON.parse(cachedData) : null;
  
  // Use cached data if it's less than 5 minutes old
  const shouldUseCache = parsedCache && 
    (Date.now() - parsedCache.timestamp < 5 * 60 * 1000);

  return {
    ...queryResult,
    data: queryResult.data || (shouldUseCache ? parsedCache.data : null),
  };
};