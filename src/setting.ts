import { createEvent } from 'effector';

type StorageType = 'local' | 'session';

const PREFIX = (0xeffec ** 2).toString(36);

function getStorage(type: StorageType) {
  return type === 'session' ? sessionStorage : localStorage;
}

function read(name: string, defaultValue: string, storageType: StorageType = 'local'): string {
  return getStorage(storageType).getItem(`${PREFIX}-${name}`) ?? defaultValue;
}

function write(name: string, value: string, storageType: StorageType = 'local'): string {
  getStorage(storageType).setItem(`${PREFIX}-${name}`, value);
  return value;
}

export function createSetting(name: string, defaultValue: string) {
  const save = createEvent<string>();
  save.watch((value) => write(name, value));
  return {
    read: () => read(name, defaultValue),
    write: (value: string) => write(name, value),
    save,
  };
}

export function createJsonSetting<T>(name: string, defaultValue: T, storageType: StorageType = 'local') {
  const save = createEvent<T>();
  save.watch((value) => write(name, JSON.stringify(value), storageType));
  return {
    read: (): T => JSON.parse(read(name, JSON.stringify(defaultValue), storageType)),
    write: (value: T): T => {
      write(name, JSON.stringify(value), storageType);
      return value;
    },
    save,
  };
}
