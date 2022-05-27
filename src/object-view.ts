import { Store, createEvent, createStore, combine } from 'effector';
import { list, h, variant, spec, rec, handler, remap } from 'forest';

import { Content, ListItem } from './components';

const typeRegexp = /\[object ([\w\s]+)\]/;

function getType(value: unknown): 'unknown' | string {
  const typeString = Object.prototype.toString.call(value);
  const match = typeRegexp.exec(typeString);
  return match ? match[1] : 'unknown';
}

export function ObjectView<T extends any>(_: { value: Store<T> }): void {
  const Value = rec<{ value: any; key: string; parentOpened: boolean }>(({ store: $props }) => {
    const [$value, $parentOpened] = remap($props, ['value', 'parentOpened']);

    const foldableClicked = createEvent<MouseEvent>();
    const $localOpened = createStore(false, {serialize:'ignore'}).on(foldableClicked, (opened) => !opened);

    const $opened = combine($parentOpened, $localOpened, (parent, local) =>
      parent === true ? local : false,
    );

    variant({
      source: combine($value, $opened, (value, opened) => ({
        type: getType(value),
        value,
        opened,
      })),
      key: 'type',
      cases: {
        //#region
        String: ({ store }) => Content.string({ text: ['"', remap(store, 'value'), '"'] }),
        Number: ({ store }) => Content.number({ text: remap(store, 'value') }),
        BigInt: ({ store }) =>
          Content.number({
            text: [remap(store, 'value'), 'n'],
            attr: { title: 'BigInt' },
          }),
        Boolean: ({ store }) => Content.boolean({ text: remap(store, 'value') }),
        Null: () => Content.keyword({ text: 'null' }),
        Undefined: () => Content.keyword({ text: 'undefined' }),
        Symbol: ({ store }) => Content.symbol({ text: remap(store, 'value') }),

        RegExp({ store: $variantSource }) {
          const $value = remap($variantSource, 'value') as Store<RegExp>;
          const [$source, $flags] = remap($value, ['source', 'flags']);

          Content.regexp({ text: ['/', $source, '/', $flags] });
        },

        Function({ store: $variantSource }) {
          const $value = remap($variantSource, 'value') as Store<Function>;
          const attr = { title: $value.map((ƒ) => ƒ.toString()) };
          h('span', { text: 'function', attr });
          Content.keyword({
            text: $value.map((ƒ) => (ƒ.name ? ` ${ƒ.name}` : '')),
            attr,
          });
          h('span', { text: '()', attr });
        },

        AsyncFunction({ store: $variantSource }) {
          const $value = remap($variantSource, 'value');
          const attr = { title: $value.map((ƒ) => ƒ.toString()) };
          h('span', { text: 'async function', attr });
          Content.keyword({
            text: $value.map((ƒ) => (ƒ.name ? ` ${ƒ.name}` : '')),
            attr,
          });
          h('span', { text: '()', attr });
        },

        Window({ store: $variantSource }) {
          const $opened = remap($variantSource, 'opened');
          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', {
              text: 'Window {...',
              fn() {
                handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
              },
            });
            spec({ text: '}' });
          });
        },

        Date() {
          Content.date({
            text: $value.map((date) => date.toISOString?.()),
            attr: { title: $value },
          });
        },

        Array({ store: $variantSource }) {
          const [$value, $opened] = remap($variantSource, ['value', 'opened']);
          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', {
              text: 'Array [',
              data: { clickable: true },
              fn() {
                handler(
                  { passive: true, stop: true, capture: true, prevent: true },
                  { click: foldableClicked },
                );
              },
            });

            list($value, ({ store, key }) =>
              ListItem(() =>
                Value({
                  store: combine({
                    value: store,
                    parentOpened: $opened,
                    key: key.map(String),
                  }),
                }),
              ),
            );
            spec({ text: ']' });
          });
        },

        Arguments({ store: $variantSource }) {
          const [$value, $opened] = remap($variantSource, ['value', 'opened']);
          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', {
              text: 'Arguments [',
              fn() {
                handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
              },
            });

            list(
              $value.map((args) => [...args] as unknown[]),
              ({ store, key }) =>
                ListItem(() =>
                  Value({
                    store: combine({
                      value: store,
                      parentOpened: $opened,
                      key: key.map(String),
                    }),
                  }),
                ),
            );
            spec({ text: ']' });
          });
        },
        Set({ store: $variantSource }) {
          const [$value, $opened] = remap($variantSource, ['value', 'opened']);
          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', {
              text: 'Set [',
              fn() {
                handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
              },
            });

            list(
              $value.map((set) => [...set.values()] as unknown[]),
              ({ store, key }) =>
                ListItem(() =>
                  Value({
                    store: combine({
                      value: store,
                      parentOpened: $opened,
                      key: key.map(String),
                    }),
                  }),
                ),
            );
            spec({ text: ']' });
          });
        },

        Map({ store: $variantSource }) {
          const [$value, $opened] = remap($variantSource, ['value', 'opened']);
          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', () => {
              spec({ text: 'Map {' });
              handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
            });

            list(
              $value.map((map) => [...map.entries()] as [string, unknown][]),
              ({ store: $entryItem }) => {
                const [$key, $value] = remap($entryItem, ['0', '1']);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $key, `"`],
                    fn() {
                      handler(
                        { passive: true, stop: true, capture: true },
                        { click: foldableClicked },
                      );
                    },
                  });

                  h('span', { text: ' => ' });
                  Value({
                    store: combine({
                      value: $value,
                      parentOpened: $opened,
                      key: $key,
                    }),
                  });
                });
              },
            );
            spec({ text: '}' });
          });
        },

        Error({ store: $variantSource }) {
          const [$value, $opened] = remap($variantSource, ['value', 'opened']);

          const [$name, $message] = remap($value as Store<Error>, ['name', 'message']);
          const $stack = $value.map((error) => error.stack ?? null);

          h('span', () => {
            spec({ data: { opened: $opened } });

            h('span', {
              text: [$name, ' {'],
              attr: { title: $value.map((error) => error.constructor.name) },
              fn() {
                handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
              },
            });

            ListItem(() => {
              spec({ data: { hidden: 'expanded' } });

              Content.string({
                text: [`"message"`],
                fn() {
                  handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
                },
              });
              h('span', { text: ': ' });
              Value({
                store: combine({
                  value: $message,
                  parentOpened: $opened,
                  key: 'message',
                }),
              });
            });

            ListItem(() => {
              spec({ data: { hidden: 'folded' } });

              Content.string({
                text: [`"stack"`],
                fn() {
                  handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
                },
              });
              h('span', { text: ': ' });

              const store = combine({
                value: $stack,
                parentOpened: $opened,
                key: 'stack',
              });
              Value({ store });
            });

            list(
              $value.map((object) => [...Object.entries(object)]),
              ({ store: $errorEntry }) => {
                const [$key, $value] = remap($errorEntry, ['0', '1']);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $key, `"`],
                    fn() {
                      handler(
                        { passive: true, stop: true, capture: true },
                        { click: foldableClicked },
                      );
                    },
                  });

                  h('span', { text: ': ' });
                  Value({
                    store: combine({
                      value: $value,
                      parentOpened: $opened,
                      key: $key,
                    }),
                  });
                });
              },
            );
          });

          h('span', { text: '}' });
        },
        //#endregion
        __({ store: $variantSource }) {
          h('span', () => {
            const [$type, $value, $opened] = remap($variantSource, ['type', 'value', 'opened']);
            spec({ data: { opened: $opened } });

            h('span', {
              text: [$type, ' {'],
              fn() {
                handler({ passive: true, stop: true, capture: true }, { click: foldableClicked });
              },
            });

            list(
              $value.map((object) => [...Object.entries(object as object)]),
              ({ store: $entry }) => {
                const [$entryKey, $entryValue] = remap($entry, ['0', '1']);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $entryKey, `"`],
                    fn() {
                      handler(
                        { passive: true, stop: true, capture: true },
                        { click: foldableClicked },
                      );
                    },
                  });

                  h('span', { text: ': ' });
                  Value({
                    store: combine({
                      value: $entryValue,
                      parentOpened: $opened,
                      key: $entryKey,
                    }),
                  });
                });
              },
            );
          });
          h('span', { text: '}' });
        },
      },
    });
  });

  const value = _.value;

  const store = combine(
    {
      value,
      parentOpened: createStore(true,{serialize:'ignore'}),
      key: '',
    },
    (a) => a, // solving ts errors
  );

  Value({ store });
}
