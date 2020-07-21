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
      Stores($stores);
      // Events($events)
    },
  });
}

function Stores($stores: Store<Record<string, StoreMeta>>) {
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
                ObjectView({ value: $value });
              });
            });
          },
        });
      });
    });
  });
}
