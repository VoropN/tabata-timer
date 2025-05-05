'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';

type UseLocalStorage<T> = {
  setValue: Dispatch<SetStateAction<any>>;
  value: T;
  key: LocalStorageKey;
  type?: 'number' | 'string';
};

export enum LocalStorageKey {
  theme,
  fontSize,
  workTime,
  restTime,
  rounds,
}

export const useLocalStorage = <T>({
  setValue,
  key,
  value,
  type,
}: UseLocalStorage<T>) => {
  useEffect(() => {
    const storedValue = getFromStorage(key, value);
    setValue(type === 'number' ? Number(storedValue) : storedValue);
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
