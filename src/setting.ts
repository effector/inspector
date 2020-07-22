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
