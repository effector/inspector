import { combine, createEvent, createStore, sample, Store } from 'effector';
import { h, list } from 'forest';
import { styled } from 'foliage';

import { EffectMeta, EventMeta, FilesMap, StoreMeta } from './types.h';
import { Column, Panel, Row, Select, Node, NodeList, NodeTitle, NodeButton } from './components';
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
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          NodeButton({ text: 'Clean', handler: { click: fileCleanup.prepend(() => {}) } });
        },
      });

      Column({
        visible: $noFileSelected,
        fn() {
          h('h5', { text: 'Please, select file from the list' });
          FileList(() => {
            list($filesList, ({ store }) => {
              const selectFile = createEvent<MouseEvent>();
              sample({
                source: store,
                clock: selectFile,
                target: fileSelected,
              });
              FileItem({ text: store, handler: { click: selectFile } });
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
        (file, files, events) => {
          if (file === '' || !files[file]) {
            return {};
          }

          return Object.fromEntries(
            files[file]
              .filter(({ kind }) => kind === 'event')
              .map(({ name }) => [name, events[name]]),
          );
        },
      );
      const $stores = combine(
        $currentFile,
        source.$files,
        source.$stores,
        (file, files, stores) => {
          if (file === '' || !files[file]) {
            return {};
          }

          return Object.fromEntries(
            files[file]
              .filter(({ kind }) => kind === 'store')
              .map(({ name }) => [name, stores[name]]),
          );
        },
      );
      const $effects = combine(
        $currentFile,
        source.$files,
        source.$effects,
        (file, files, effects) => {
          if (file === '' || !files[file]) {
            return {};
          }

          return Object.fromEntries(
            files[file]
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

const FileList = styled.ul`
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

const FileItem = styled.li`
  color: var(--primary-text);
  font-family: 'JetBrains Mono', hasklig, monofur, monospace;
  font-size: 14px;

  border: var(--primary);
  padding: 0.2rem 0.4rem;

  cursor: pointer;

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 1px var(--primary-dark), 0 0 3px 0 var(--primary-dark);
  }

  &:hover {
    background-color: var(--primary-dark);
  }
`;
