'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type UseLocalStorage<T> = {
  setValue: Dispatch<SetStateAction<T>>;
  value: T;
  key: LocalStorageKey;
  type?: 'number' | 'string' | 'boolean' | 'object';
};

export enum LocalStorageKey {
  theme = 'theme',
  fontSize = 'fontSize',
  workTime = 'workTime',
  restTime = 'restTime',
  rounds = 'rounds',
  isMuted = 'isMuted',
  preset = 'preset'
}

let storageHydrated = false;
const hydrationListeners = new Set<() => void>();

function notifyHydration() {
  if (storageHydrated) return;
  storageHydrated = true;
  hydrationListeners.forEach((l) => l());
}

export const useIsStorageHydrated = () => {
  const [hydrated, setHydrated] = useState(storageHydrated);

  useEffect(() => {
    if (storageHydrated) {
      setHydrated(true);
      return;
    }
    const listener = () => setHydrated(true);
    hydrationListeners.add(listener);
    return () => {
      hydrationListeners.delete(listener);
    };
  }, []);

  return hydrated;
};

export const useLocalStorage = <T>({
  setValue,
  key,
  value,
  type,
}: UseLocalStorage<T>) => {
  const skipSaveRef = useRef(true);

  useEffect(() => {
    const storedValue = getFromStorage(key, value);
    if (type === 'boolean') {
      setValue(JSON.parse(String(storedValue)) as T);
    } else if (type === 'number') {
      setValue(Number(storedValue) as T);
    } else if (type === 'object') {
      setValue(JSON.parse(String(storedValue ?? null)) as T);
    } else {
      setValue(storedValue as T);
    }
    notifyHydration();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    saveToStorage(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }, [key, value]);
};

export const getFromStorage = (
  key: LocalStorageKey,
  defaultValue: unknown
): unknown => localStorage.getItem(String(key)) ?? defaultValue;

export const saveToStorage = (key: LocalStorageKey, value: unknown) =>
  localStorage.setItem(String(key), String(value));
