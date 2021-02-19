import { Store, createEvent, createStore } from 'effector';
import { list, h, variant, spec, rec, handler } from 'forest';

import { Content, ListItem } from './components';

const typeRegexp = /\[object ([\w\s]+)\]/;
function getType(value: unknown): 'unknown' | string {
  const typeString = Object.prototype.toString.call(value);
  const match = typeRegexp.exec(typeString);
  return match ? match[1] : 'unknown';
}

export function ObjectView<T extends any>(_: { value: Store<T> }): void {
  const Value = rec<any>(({ store: $value }) => {
    variant({
      source: $value.map((value) => ({ type: getType(value) })),
      key: 'type',
      cases: {
        String: () => Content.string({ text: ['"', $value, '"'] }),
        Number: () => Content.number({ text: $value }),
        BigInt: () =>
          Content.number({ text: [$value, 'n'], attr: { title: 'BigInt' } }),
        Boolean: () => Content.boolean({ text: $value }),
        Null: () => Content.keyword({ text: 'null' }),
        Undefined: () => Content.keyword({ text: 'undefined' }),
        Symbol: () => Content.symbol({ text: $value }),

        RegExp() {
          const $source = $value.map((rx) => rx.source);
          const $flags = $value.map((rx) => rx.flags);

          Content.regexp({ text: ['/', $source, '/', $flags] });
        },

        Function() {
          const attr = { title: $value.map((ƒ) => ƒ.toString()) };
          h('span', { text: 'function', attr });
          Content.keyword({
            text: $value.map((ƒ) => (ƒ.name ? ` ${ƒ.name}` : '')),
            attr,
          });
          h('span', { text: '()', attr });
        },

        AsyncFunction() {
          const attr = { title: $value.map((ƒ) => ƒ.toString()) };
          h('span', { text: 'async function', attr });
          Content.keyword({
            text: $value.map((ƒ) => (ƒ.name ? ` ${ƒ.name}` : '')),
            attr,
          });
          h('span', { text: '()', attr });
        },

        Window() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: 'Window {...',
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
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

        Array() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: '[',
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
              },
            });

            list($value, ({ store }) => ListItem(() => Value({ store })));
            spec({ text: ']' });
          });
        },

        Arguments() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: 'Arguments [',
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
              },
            });

            list(
              $value.map((args) => [...args]),
              ({ store }) => ListItem(() => Value({ store })),
            );
            spec({ text: ']' });
          });
        },

        Set() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: 'Set [',
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
              },
            });

            list(
              $value.map((set) => [...set.values()]),
              ({ store }) => ListItem(() => Value({ store })),
            );
            spec({ text: ']' });
          });
        },

        Map() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', () => {
              spec({ text: 'Map {' });
              handler({ passive: true, capture: true, stop: true }, { click });
            });

            list(
              $value.map((map) => [...map.entries()]),
              ({ store }) => {
                const $key = store.map(([key]) => key);
                const $value = store.map(([, value]) => value);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $key, `"`],
                    fn() {
                      handler(
                        { passive: true, capture: true, stop: true },
                        { click },
                      );
                    },
                  });

                  h('span', { text: ' => ' });
                  Value({ store: $value });
                });
              },
            );
            spec({ text: '}' });
          });
        },

        Error() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: [$value.map((error) => error.name), ' {'],
              attr: { title: $value.map((error) => error.constructor.name) },
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
              },
            });

            ListItem(() => {
              spec({ data: { hidden: 'expanded' } });

              Content.string({
                text: [`"message"`],
                fn() {
                  handler(
                    { passive: true, capture: true, stop: true },
                    { click },
                  );
                },
              });
              h('span', { text: ': ' });
              Value({ store: $value.map((error) => error.message) });
            });

            ListItem(() => {
              spec({ data: { hidden: 'folded' } });

              Content.string({
                text: [`"stack"`],
                fn() {
                  handler(
                    { passive: true, capture: true, stop: true },
                    { click },
                  );
                },
              });
              h('span', { text: ': ' });
              Value({ store: $value.map((error) => error.stack) });
            });

            list(
              $value.map((object) => [...Object.entries(object)]),
              ({ store }) => {
                const $key = store.map(([key]) => key);
                const $value = store.map(([, value]) => value);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $key, `"`],
                    fn() {
                      handler(
                        { passive: true, capture: true, stop: true },
                        { click },
                      );
                    },
                  });

                  h('span', { text: ': ' });
                  Value({ store: $value });
                });
              },
            );
          });

          h('span', { text: '}' });
        },

        __({ store }) {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', {
              text: [store.map(({ type }) => type), ' {'],
              fn() {
                handler(
                  { passive: true, capture: true, stop: true },
                  { click },
                );
              },
            });

            list(
              $value.map((object) => [...Object.entries(object)]),
              ({ store }) => {
                const $key = store.map(([key]) => key);
                const $value = store.map(([, value]) => value);

                ListItem(() => {
                  Content.string({
                    text: [`"`, $key, `"`],
                    fn() {
                      handler(
                        { passive: true, capture: true, stop: true },
                        { click },
                      );
                    },
                  });

                  h('span', { text: ': ' });
                  Value({ store: $value });
                });
              },
            );
          });
          h('span', { text: '}' });
        },
      },
    });
  });

  Value({ store: _.value });
}
