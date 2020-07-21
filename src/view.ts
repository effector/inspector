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
        String() {
          h('span', {
            text: ['"', $value, '"'],
            data: { style: 'string' },
          });
        },
        Number() {
          h('span', {
            text: $value,
            data: { style: 'number' },
          });
        },
        Boolean() {
          h('span', {
            text: $value,
            data: { style: 'boolean' },
          });
        },
        Null() {
          h('span', { text: 'null', data: { style: 'null' } });
        },
        Undefined() {
          h('span', { text: 'undefined', data: { style: 'null' } });
        },
        Symbol() {
          h('span', { text: $value });
        },
        Date() {
          h('span', {
            text: $value.map((date) => date.toISOString?.()),
            attr: { title: $value },
            data: { style: 'date' },
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
              ({ store }) => {
                h('span', () => {
                  spec({ data: { kind: 'list-item' } });
                  Value({ state: store });
                });
              },
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

                h('span', () => {
                  spec({ data: { kind: 'list-item' } });
                  h('span', {
                    data: { style: 'string' },
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

                h('span', () => {
                  spec({ data: { kind: 'list-item' } });
                  h('span', {
                    data: { style: 'string' },
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
              NodeTitle({ text: [$name, ': '] });
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
