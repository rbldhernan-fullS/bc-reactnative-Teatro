// ===== SEMANA 07 · INICIO =====
import { useCallback, useEffect, useState } from 'react';

import { storage } from './mmkv';

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function subscribe(key: string, listener: Listener): () => void {
  const group = listeners.get(key) ?? new Set<Listener>();
  group.add(listener);
  listeners.set(key, group);

  return () => {
    group.delete(listener);
  };
}

function notify(key: string): void {
  listeners.get(key)?.forEach((listener) => listener());
}

function readString(key: string): string | undefined {
  return storage.getString(key);
}

function writeString(key: string, value: string | undefined): void {
  if (value === undefined) {
    storage.remove(key);
    return;
  }

  storage.set(key, value);
}

function readBoolean(key: string): boolean | undefined {
  return storage.getBoolean(key);
}

function writeBoolean(key: string, value: boolean | undefined): void {
  if (value === undefined) {
    storage.remove(key);
    return;
  }

  storage.set(key, value);
}

function readNumber(key: string): number | undefined {
  return storage.getNumber(key);
}

function writeNumber(key: string, value: number | undefined): void {
  if (value === undefined) {
    storage.remove(key);
    return;
  }

  storage.set(key, value);
}

function useStoredValue<T>(
  key: string,
  read: (name: string) => T | undefined,
  write: (name: string, value: T | undefined) => void
): [T | undefined, (value: T | undefined) => void] {
  const [value, setValue] = useState<T | undefined>(() => read(key));

  useEffect(() => {
    const unsubscribe = subscribe(key, () => setValue(read(key)));
    setValue(read(key));

    return unsubscribe;
  }, [key, read]);

  const update = useCallback(
    (next: T | undefined): void => {
      write(key, next);
      setValue(next);
      notify(key);
    },
    [key, write]
  );

  return [value, update];
}

export function useMMKVString(
  key: string
): [string | undefined, (value: string | undefined) => void] {
  return useStoredValue(key, readString, writeString);
}

export function useMMKVBoolean(
  key: string
): [boolean | undefined, (value: boolean | undefined) => void] {
  return useStoredValue(key, readBoolean, writeBoolean);
}

export function useMMKVNumber(
  key: string
): [number | undefined, (value: number | undefined) => void] {
  return useStoredValue(key, readNumber, writeNumber);
}
// ===== SEMANA 07 · FIN =====
