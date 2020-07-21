import { createStore, createEvent, Store, Event, restore } from 'effector';
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
  NodeButton,
} from './components';
import { ObjectView } from './object-view';
import { StoreMeta, EventMeta, LogMeta } from './types.h';

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
  $events: Store<Record<string, EventMeta>>,
  $logs: Store<LogMeta[]>,
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
          fn({ changeTab }) {
            Stores($stores);
          },
        },
        example: {
          title: 'Example',
          fn({ changeTab }) {
            h('span', { text: 'Hey' });
          },
        },
        // events: {
        //   title: 'Events',
        //   fn({ changeTab }) {
        //     Events($events, changeTab);
        //   },
        // },
        logs: {
          title: 'Logs',
          fn({ changeTab }) {
            Logs($logs);
          },
        },
      });
    },
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
          NodeTitle({ text: [$name, ': '] });
          NodeContent(() => {
            ObjectView({ value: $value });
          });
        });
      },
    });
  });
}

// function Events(
//   $events: Store<Record<string, EventMeta>>,
//   _changeTab: Event<string>,
// ) {
//   NodeList(() => {
//     const $list = $events.map((map) =>
//       Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
//     );

//     list({
//       source: $list,
//       key: 'name',
//       fields: ['name', 'lastTriggeredWith'],
//       fn({ fields: [$name] }) {
//         Node(() => {
//           NodeTitle({ text: [$name, ' '] });
//           // NodeContent(() => {
//           //   h('span', { text: 'with: ' });
//           //   ObjectView({ value: $lastTriggeredParams });
//           // });
//           // NodeButton({
//           //   text: 'Logs',
//           //   handler: { click: changeTab.prepend(() => 'logs') },
//           // });
//         });
//       },
//     });
//   });
// }

function Logs($logs: Store<LogMeta[]>) {
  NodeList(() => {
    list({
      source: $logs,
      key: 'id',
      fields: ['kind', 'name', 'payload', 'datetime'],
      fn({ fields: [$kind, $name, $payload, $datetime] }) {
        Node(() => {
          const $iso = $datetime.map((date) => date.toISOString());
          const $time = $datetime.map((date) => date.toLocaleTimeString());

          NodeTitle({
            text: [$time, ' » ', $kind as Store<string>, ' "', $name, '" '],
            attr: { title: $iso },
          });
          NodeContent(() => {
            ObjectView({ value: $payload });
          });
        });
      },
    });
  });
}

type TabConfig<T> = {
  title: string | Store<string>;
  fn: (_: { changeTab: Event<T> }) => void;
};
type TabsConfig<Keys extends string> = Record<Keys, TabConfig<Keys>>;

function Tabs<Keys extends string>(tabs: TabsConfig<Keys>) {
  const changeTab = createEvent<string>();
  const $tab = restore(changeTab, Object.keys(tabs)[0]);

  Section(() => {
    SectionHead(() => {
      for (const [key, tab] of Object.entries<TabConfig<Keys>>(tabs)) {
        SectionTab({
          text: tab.title,
          data: {
            active: $tab.map((current) => current === key),
          },
          handler: { click: changeTab.prepend(() => key) },
        });
      }
    });
    for (const [key, tab] of Object.entries<TabConfig<Keys>>(tabs)) {
      SectionContent({
        visible: $tab.map((current) => current === key),
        fn() {
          tab.fn({ changeTab });
        },
      });
    }
  });
}
