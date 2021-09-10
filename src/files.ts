import { combine, createEvent, createStore, restore, sample, Store } from 'effector';
import { h, list, node } from 'forest';
import { styled } from 'foliage';

import { EffectMeta, EventMeta, FilesMap, StoreMeta } from './types.h';
import {
  Column,
  Panel,
  Row,
  Select,
  Node,
  NodeList,
  NodeTitle,
  NodeButton,
  Input,
} from './components';
import { Stores } from './stores';
import { Events } from './events';
import { Effects } from './effects';

export function Files(source: {
  $stores: Store<Record<string, StoreMeta>>;
  $events: Store<Record<string, EventMeta>>;
  $effects: Store<Record<string, EffectMeta>>;
  $files: Store<FilesMap>;
}) {
  const $filesList = source.$files.map((files) =>
    Object.keys(files).sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }),
  );
  const $hasFiles = $filesList.map((files) => files.length > 0);

  const fileSelected = createEvent<string>();
  const fileCleanup = createEvent();

  const $currentFile = createStore('');
  const $hasSelectedFile = $currentFile.map((file) => file !== '');
  const $noFileSelected = $hasSelectedFile.map((has) => !has);

  $currentFile.on(fileSelected, (_, file) => file).on(fileCleanup, () => '');

  Panel({
    style: { flexDirection: 'column' },
    visible: $hasFiles,
    fn() {
      Row({
        visible: $hasSelectedFile,
        fn() {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          NodeButton({ text: '◀', handler: { click: fileCleanup.prepend(() => {}) } });
          h('span', { text: 'File:' });
          Select({
            handler: {
              change: fileSelected.prepend((e) => (e.currentTarget as HTMLSelectElement).value),
            },
            fn() {
              list($filesList, ({ store }) => {
                h('option', {
                  attr: {
                    value: store,
                    selected: combine(store, $currentFile, (item, selected) => item === selected),
                  },
                  text: store,
                });
              });
            },
          });
        },
      });

      Column({
        visible: $noFileSelected,
        fn() {
          const filterChanged = createEvent<string>();
          const $filter = restore(filterChanged, '');
          const $filteredFiles = combine($filter, $filesList, (searchWord, list) =>
            list.filter((file) => file.includes(searchWord)),
          );

          Title({ text: 'Please, select file from the list or type the name' });
          const searchChanged = filterChanged.prepend(
            (e: Event | KeyboardEvent) => (e.currentTarget as HTMLInputElement)?.value,
          );
          Column(() => {
            Search({
              attr: { value: $filter, placeholder: 'Type a part of the file name' },
              handler: { change: searchChanged, keydown: searchChanged as any },
            });
            FileList(() => {
              list($filteredFiles, ({ store, key }) => {
                const selectFile = createEvent<MouseEvent>();
                sample({
                  source: store,
                  clock: selectFile,
                  target: fileSelected,
                });
                FileItem({
                  text: store,
                  attr: { tabIndex: '0' },
                  handler: { click: selectFile },
                });
              });
            });
          });
        },
      });
    },
  });

  Panel({
    visible: $hasSelectedFile,
    fn() {
      const $events = combine(
        $currentFile,
        source.$files,
        source.$events,
        (current, files, events) => {
          if (current === '' || !files[current]) {
            return {};
          }

          return Object.fromEntries(
            files[current]
              .filter(({ kind }) => kind === 'event')
              .map(({ name }) => [name, events[name]]),
          );
        },
      );
      const $stores = combine(
        $currentFile,
        source.$files,
        source.$stores,
        (current, files, stores) => {
          if (current === '' || !files[current]) {
            return {};
          }

          return Object.fromEntries(
            files[current]
              .filter(({ kind }) => kind === 'store')
              .map(({ name }) => [name, stores[name]]),
          );
        },
      );
      const $effects = combine(
        $currentFile,
        source.$files,
        source.$effects,
        (current, files, effects) => {
          if (current === '' || !files[current]) {
            return {};
          }

          return Object.fromEntries(
            files[current]
              .filter(({ kind }) => kind === 'effect')
              .map(({ name }) => [name, effects[name]]),
          );
        },
      );
      Column(() => {
        Events($events);
        Stores($stores);
        Effects($effects);
      });
    },
  });
}

const Title = styled.h4`
  margin-top: 0;
`;

const Search = styled.input`
  display: flex;
  flex-shrink: 0;
  padding: 0 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.2rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 2rem;

  &:focus {
    border-color: var(--primary);
    outline: 0;
    box-shadow: 0 0 0 2px var(--primary);
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0;
  padding: 0 0;
  overflow-x: auto;
  align-items: stretch;

  list-style-type: none;

  :nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const FileItem = styled.button`
  color: var(--text);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  font-size: 14px;
  text-align: left;

  border: var(--primary);
  padding: 0.2rem 0.4rem;

  cursor: pointer;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--primary-dark);
  }
`;
