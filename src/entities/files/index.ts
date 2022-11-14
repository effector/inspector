import { createStore } from 'effector';

type FileName = string;
export type FilesMap = Record<
  FileName,
  Array<{ kind: 'store' | 'event' | 'effect'; name: string }>
>;

export const $files = createStore<FilesMap>({}, { serialize: 'ignore' });
