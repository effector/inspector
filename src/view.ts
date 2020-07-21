import { createStore, createEvent, Store } from 'effector';
import { list, h, variant, spec, rec, handler } from 'forest';
import {
  Container,
  SectionHead,
  SectionContent,
  NodeList,
  Node,
  NodeTitle,
  NodeContent,
  Section,
  Content,
  ListItem,
  ListItem,
} from './components';
import { StoreMeta } from './types.h';

const KEY_B = 2;

const $isVisible = createStore(false);
const togglePressed = createEvent();
const showInspector = createEvent();

document.addEventListener('keypress', (event) => {
  if (event.keyCode === KEY_B && event.ctrlKey) {
    togglePressed();
  }
});

$isVisible
  .on(togglePressed, (visible) => !visible)
  .on(showInspector, () => true);

export function Root(
  $stores: Store<Record<string, StoreMeta>>,
  visible = false,
) {
  if (visible) {
    showInspector();
  }

  console.info(
    '%c[effector-inspector] %cPress %cCTRL+B %cto open Inspector',
    'color: gray; font-size: 1rem;',
    'color: currentColor; font-size: 1rem;',
    'color: deepskyblue; font-family: monospace; font-size: 1rem;',
    'color: currentColor; font-size: 1rem;',
  );

  Container({
    visible: $isVisible,
    fn() {
      Stores($stores);
      // Events($events)
    },
  });
}

const typeRegexp = /\[object (\w+)\]/;
function getType(value: unknown): 'unknown' | string {
  const typeString = Object.prototype.toString.call(value);
  const match = typeRegexp.exec(typeString);
  return match ? match[1] : 'unknown';
}

function Stores($stores: Store<Record<string, StoreMeta>>) {
  const Value = rec<any>(({ state: $value }) => {
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

        Function() {
          const attr = { title: $value.map((ƒ) => ƒ.toString()) };
          h('span', { text: 'function', attr });
          Content.keyword({
            text: $value.map((ƒ) => (ƒ.name ? ` ${ƒ.name}` : '')),
            attr,
          });
          h('span', { text: '()', attr });
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

            list($value, ({ store }) =>
              ListItem(() => Value({ state: store })),
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
              ({ store }) => ListItem(() => Value({ state: store })),
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
                  Value({ state: $value });
                });
              },
            );
            spec({ text: '}' });
          });
        },

        __() {
          h('span', () => {
            const click = createEvent<MouseEvent>();
            const opened = createStore(false).on(click, (is) => !is);
            spec({ data: { opened } });

            h('span', { text: '{' });
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
                  Value({ state: $value });
                });
              },
            );
            h('span', { text: '}' });
          });
        },
      },
    });
  });

  Section(() => {
    SectionHead({ text: 'Stores' });
    SectionContent(() => {
      NodeList(() => {
        const $list = $stores.map((map) =>
          Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
        );

        list({
          source: $list,
          key: 'name',
          fields: ['name', 'value'],
          fn({ fields: [$name, $value] }) {
            Node(() => {
              NodeTitle({ text: [$name] });
              NodeContent(() => {
                Value({ state: $value });
              });
            });
          },
        });
      });
    });
  });
}
