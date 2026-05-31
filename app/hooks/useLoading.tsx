'use client';

import { useIsStorageHydrated } from './useLocalStorage';

export const useLoading = () => {
  const isHydrated = useIsStorageHydrated();
  return { isLoading: !isHydrated };
};
