import { createStore, createEvent, Store } from 'effector';

import { StoreMeta, EventMeta, LogMeta, EffectMeta } from './types.h';
import { Container } from './components';
import { Tabs } from './tabs';
import { Logs } from './logs';
import { Stores } from './stores';
import { Events } from './events';
import { Effects } from './effects';

const KEY_B = 2;

const $isVisible = createStore(false);
const togglePressed = createEvent();
const showInspector = createEvent();

typeof document === 'object' && document.addEventListener('keypress', (event) => {
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
  $effects: Store<Record<string, EffectMeta>>,
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
          fn() {
            Stores($stores);
          },
        },
        effects: {
          title: 'Effects',
          fn() {
            Effects($effects);
          },
        },
        events: {
          title: 'Events',
          fn() {
            Events($events);
          },
        },
        logs: {
          title: 'Logs',
          fn() {
            Logs($logs);
          },
        },
      });
    },
  });
}
