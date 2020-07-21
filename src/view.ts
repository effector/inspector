import { createStore, createEvent, Store, restore } from 'effector';
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
  SectionTab,
} from './components';
import { ObjectView } from './object-view';
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
      Tabs({
        stores: {
          title: 'Stores',
          fn() {
            Stores($stores);
          },
        },
        // events: {
        //   title: 'Events',
        //   fn() {
        //     Node({ text: 'events' });
        //   },
        // },
        // logs: {
        //   title: 'Logs',
        //   fn() {
        //     Node({ text: 'Logs' });
        //   },
        // },
      });
    },
  });
}

function Tabs(
  tabs: Record<string, { title: string | Store<string>; fn: () => void }>,
) {
  const changeTab = createEvent<string>();
  const $tab = restore(changeTab, Object.keys(tabs)[0]);

  Section(() => {
    SectionHead(() => {
      for (const [key, tab] of Object.entries(tabs)) {
        SectionTab({
          text: tab.title,
          data: { active: $tab.map((current) => current === key) },
          handler: { click: changeTab.prepend(() => key) },
        });
      }
    });
    for (const [key, tab] of Object.entries(tabs)) {
      SectionContent({
        visible: $tab.map((current) => current === key),
        fn: tab.fn,
      });
    }
  });
}

function Stores($stores: Store<Record<string, StoreMeta>>) {
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
            ObjectView({ value: $value });
          });
        });
      },
    });
  });
}
