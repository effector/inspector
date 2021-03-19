import { createEvent } from 'effector';

const PREFIX = (0xeffec ** 2).toString(36);

function read(name: string, defaultValue: string): string {
  return localStorage.getItem(`${PREFIX}-${name}`) ?? defaultValue;
}

function write(name: string, value: string): string {
  localStorage.setItem(`${PREFIX}-${name}`, value);
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

export function createJsonSetting<T>(name: string, defaultValue: T) {
  const save = createEvent<T>();
  save.watch((value) => write(name, JSON.stringify(value)));
  return {
    read: (): T => JSON.parse(read(name, JSON.stringify(defaultValue))),
    write: (value: T): T => {
      write(name, JSON.stringify(value));
      return value;
    },
    save,
  };
}
