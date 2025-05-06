'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';

type UseLocalStorage<T> = {
  setValue: Dispatch<SetStateAction<any>>;
  value: T;
  key: LocalStorageKey;
  type?: 'number' | 'string' | 'boolean';
};

export enum LocalStorageKey {
  theme = 'theme',
  fontSize = 'fontSize',
  workTime = 'workTime',
  restTime = 'restTime',
  rounds = 'rounds',
  isMuted = 'isMuted',
}

export const useLocalStorage = <T>({
  setValue,
  key,
  value,
  type,
}: UseLocalStorage<T>) => {
  useEffect(() => {
    const storedValue = getFromStorage(key, value);
    if (type === 'boolean') {
      setValue(JSON.parse(storedValue));
    } else if (type === 'number') {
      setValue(Number(storedValue));
    } else {
      setValue(storedValue);
    }
  }, []);

  useEffect(() => {
    saveToStorage(key, value);
  }, [value]);
};

export const getFromStorage = (
  key: LocalStorageKey,
  defaultValue: unknown
): any => localStorage.getItem(String(key)) || defaultValue;
export const saveToStorage = (key: LocalStorageKey, value: unknown) =>
  localStorage.setItem(String(key), String(value));
