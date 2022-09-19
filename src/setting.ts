import { createEvent } from 'effector';

const PREFIX = (0xeffec ** 2).toString(36);

function read(name: string, defaultValue: string, storage = localStorage): string {
  return storage.getItem(`${PREFIX}-${name}`) ?? defaultValue;
}

function write(name: string, value: string, storage = localStorage): string {
  storage.setItem(`${PREFIX}-${name}`, value);
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

export function createJsonSetting<T>(name: string, defaultValue: T, storage = localStorage) {
  const save = createEvent<T>();
  save.watch((value) => write(name, JSON.stringify(value), storage));
  return {
    read: (): T => JSON.parse(read(name, JSON.stringify(defaultValue), storage)),
    write: (value: T): T => {
      write(name, JSON.stringify(value), storage);
      return value;
    },
    save,
  };
}
