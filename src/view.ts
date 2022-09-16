import { createEvent, createStore, restore, sample, Store } from 'effector';

import {
  EffectMeta,
  EventMeta,
  FilesMap,
  LogMeta,
  Options,
  StackTrace,
  StoreMeta,
} from './types.h';
import { Container, DragHandler } from './components';
import { Tabs } from './tabs';
import { Logs } from './logs';
import { Stores } from './stores';
import { Events } from './events';
import { Effects } from './effects';
import { DOMElement, node, spec, val } from 'forest';
import { createJsonSetting } from './setting';
import { Files } from './files';
import { Traces } from './tabs/trace';

const KEY_B = 2;
const KEY_L = 12;

const $isVisible = createStore(false);
const togglePressed = createEvent();
const clearPressed = createEvent();
const showInspector = createEvent();

if (typeof document === 'object') {
  document.addEventListener('keypress', (event) => {
    if (event.ctrlKey) {
      if (event.key === 'l' || event.keyCode === KEY_L) {
        clearPressed();
      }
      if (event.key === 'b' || event.keyCode === KEY_B) {
        togglePressed();
      }
    }
  });
}

function dragdrop() {
  const $inDrag = createStore(false);
  const mouseDown = createEvent<MouseEvent>();
  const mouseMove = createEvent<MouseEvent>();
  const mouseUp = createEvent<MouseEvent>();

  $inDrag.on(mouseDown, () => true).on(mouseUp, () => false);

  spec({ handler: { mousedown: mouseDown } });

  mouseDown.watch(() => {
    if (document) {
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    }
  });

  mouseUp.watch(() => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  });

  return { mouseMove, mouseDown, mouseUp, $inDrag };
}

function ref() {
  const setRef = createEvent<DOMElement>();
  const $ref = restore(setRef, null);
  node(setRef);

  return $ref as Store<DOMElement>;
}

$isVisible.on(togglePressed, (visible) => !visible).on(showInspector, () => true);

export function Root(
  $stores: Store<Record<string, StoreMeta>>,
  $events: Store<Record<string, EventMeta>>,
  $effects: Store<Record<string, EffectMeta>>,
  $logs: Store<LogMeta[]>,
  $files: Store<FilesMap>,
  options: Options = {},
) {
  if (options.visible) {
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
      const $blockRef = ref();

      const widthSetting = createJsonSetting('width', 736);
      const $width = createStore(widthSetting.read());
      spec({ style: { width: val`${$width}px` } });

      DragHandler({
        text: '∙∙∙',
        fn() {
          const { mouseMove, mouseDown, mouseUp, $inDrag } = dragdrop();

          spec({ data: { active: $inDrag } });

          const $shift = createStore(0);

          const dragStart = sample($blockRef, mouseDown, (block, event) => ({
            block,
            event,
          }));
          const dragMove = sample($blockRef, mouseMove, (block, event) => {
            const rect = block.getBoundingClientRect();
            return rect.right - event.clientX;
          });

          const correctWidth = sample($shift, dragMove, (shift, width) => width - shift);

          $width.on(correctWidth, (_, width) => width);

          $shift.on(dragStart, (_, { block, event }) =>
            block ? block.getBoundingClientRect().left - event.clientX : 0,
          );

          sample($width, mouseUp, widthSetting.save);
        },
      });

      Tabs({
        files: {
          title: 'Files',
          fn() {
            Files({
              $stores,
              $events,
              $effects,
              $files,
              options,
            });
          },
        },
        stores: {
          title: 'Stores',
          fn() {
            Stores($stores, options);
          },
        },
        effects: {
          title: 'Effects',
          fn() {
            Effects($effects, options);
          },
        },
        events: {
          title: 'Events',
          fn() {
            Events($events, options);
          },
        },
        traces: {
          title: 'Traces',
          fn() {
            Traces();
          },
        },
        logs: {
          title: 'Logs',
          fn() {
            Logs($logs, clearPressed, options);
          },
        },
      });
    },
  });
}
