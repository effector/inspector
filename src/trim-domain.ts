import { Store } from 'effector';
import { Options } from './types.h';

export function trimDomain(source: Store<string>, options: Options): Store<string> {
  if (options.trimDomain) {
    return source.map((value) => value.replace(`${options.trimDomain!}/`, ''));
  }
  return source;
}
