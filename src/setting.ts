const PREFIX = 0xeffec ** 3;

function read(name: string, defaultValue: string): string {
  return localStorage.getItem(`${PREFIX}-${name}`) ?? defaultValue ?? '';
}

function write(name: string, value: string): string {
  localStorage.setItem(`${PREFIX}-${name}`, value);
  return value;
}

export function createSetting(name: string) {
  return {
    read: (defaultValue: string) => read(name, defaultValue),
    write: (value: string) => write(name, value),
  };
}

export function createJsonSetting<T>(name: string) {
  return {
    read: (defaultValue: T): T => JSON.parse(read(name, JSON.stringify(defaultValue))),
    write: (value: T): T => {
      write(name, JSON.stringify(value));
      return value;
    },
  };
}
