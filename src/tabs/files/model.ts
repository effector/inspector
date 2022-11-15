import {combine, createEvent, createStore} from 'effector';

import {$files} from '../../entities/files';
import {$stores} from '../../entities/stores/model';

export const fileSelected = createEvent<string>();
export const fileCleanup = createEvent();
export const filterChanged = createEvent<string>();

export const $selectedFile = createStore('', {serialize: 'ignore'});
export const $filter = createStore('');

export const $filesList = $files.map((files) => Object.keys(files));
export const $filteredFiles = combine($filter, $filesList, (searchWord, list) =>
  list.filter((file) => file.includes(searchWord)),
);

$selectedFile.on(fileSelected, (_, file) => file).reset(fileCleanup);
$filter.on(filterChanged, (_, value) => value);

export const $storesFromFile = combine($selectedFile, $files, (current, files) => {
  if (current === '' || !files[current]) {
    return [];
  }
  return files[current].filter(({kind}) => kind === 'store').map(({name}) => name);
});

export const $EventsFromFile = combine($selectedFile, $files, (current, files) => {
  if (current === '' || !files[current]) {
    return [];
  }
  return files[current].filter(({kind}) => kind === 'event').map(({name}) => name);
});

export const $EffectFromFile = combine($selectedFile, $files, (current, files) => {
  if (current === '' || !files[current]) {
    return [];
  }
  return files[current].filter(({kind}) => kind === 'effect').map(({name}) => name);
});
