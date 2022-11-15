import { createEvent, createStore, sample } from 'effector';
import { For, Match, Show, Switch } from 'solid-js';
import { useUnit } from 'effector-solid';
import { styled, createGlobalStyles } from 'solid-styled-components';

import { createJsonSetting, createSetting } from '../shared/lib/setting';
import { ThemeProvider } from '../shared/ui/styles/global';

import { Files } from '../tabs/files';
import { Stores } from '../tabs/stores';
import { Effect } from '../tabs/effects';
import { Events } from '../tabs/events';
import { Trace } from '../tabs/trace/view';
import { Logs } from '../tabs/log';
import { useDragable } from '../shared/lib/use-dragalbe';

const Tabs = {
  files: {
    title: 'Files',
    Component: Files,
  },
  stores: {
    title: 'Stores',
    Component: Stores,
  },
  effects: {
    title: 'Effects',
    Component: Effect,
  },
  events: {
    title: 'Events',
    Component: Events,
  },
  traces: {
    title: 'Traces',
    Component: Trace,
  },
  logs: {
    title: 'Logs',
    Component: Logs,
  },
};
type Keys = Array<keyof typeof Tabs>;
type Key = keyof typeof Tabs;
const tabList = Object.keys(Tabs) as Keys;
const firstTab = tabList[0];

const lastTab = createSetting('last-tab', firstTab);
const savedTab = lastTab.read() as Key;
const initialTab = tabList.includes(savedTab) ? savedTab : firstTab;
const changeTab = createEvent<Key>();
const $tab = createStore(initialTab);

$tab.on(changeTab, (_, tab) => tab);
$tab.watch(lastTab.write);

const KEY_B = 2;
const KEY_L = 12;

const visibleSettings = createJsonSetting('visible', false);
const $isVisible = createStore(visibleSettings.read(), { serialize: 'ignore' });
const togglePressed = createEvent();
const clearPressed = createEvent();
const showInspector = createEvent();

if (typeof document === 'object') {
  document.addEventListener('keydown', (event) => {
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

$isVisible.on(togglePressed, (visible) => !visible).on(showInspector, () => true);
$isVisible.watch(visibleSettings.write);

const widthChanged = createEvent<number>();
const dragStopped = createEvent();

const widthSetting = createJsonSetting('width', 736);
const $width = createStore(widthSetting.read(), { serialize: 'ignore' });

$width.on(widthChanged, (width, change) => width - change);

sample({
  clock: dragStopped,
  source: $width,
  target: widthSetting.save,
});

export function App() {
  const [currentTab, isVisible, width] = useUnit([$tab, $isVisible, $width]);

  const [onDown, isDrag] = useDragable({
    onMove({ shift }) {
      widthChanged(shift[0]);
    },
    onUp: dragStopped,
  });

  return (
    <ThemeProvider>
      {/* @ts-ignore */}
      <BodyCursor isDrag={isDrag()} />

      <Show when={isVisible()}>
        <InspectorRoot style={{ width: `${width()}px` }}>
          <DragHandler onMouseDown={onDown}>...</DragHandler>
          <TabsContainer>
            <TabsHeader>
              <For each={Object.entries(Tabs)} fallback={<div>Loading...</div>}>
                {([key, tab]) => (
                  <Tab data-active={currentTab() === key} onClick={() => changeTab(key as Key)}>
                    {tab.title}
                  </Tab>
                )}
              </For>
            </TabsHeader>
            <SectionContent>
              <Switch fallback={<div>Not Found</div>}>
                <For each={Object.entries(Tabs)} fallback={<div>Loading...</div>}>
                  {([key, tab]) => (
                    <Match when={currentTab() === key}>
                      <tab.Component />
                    </Match>
                  )}
                </For>
              </Switch>
            </SectionContent>
          </TabsContainer>
        </InspectorRoot>
      </Show>
    </ThemeProvider>
  );
}

const Tab = styled.div`
  padding: 8px 16px;

  color: var(--tab-text);

  border-radius: inherit;
  border-top-right-radius: 0;
  cursor: pointer;

  &:hover {
    box-shadow: inset 0 -2px 0 0 var(--tab-shadow-active);
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
  }

  &[data-active='true'] {
    color: var(--tab-text-active);

    box-shadow: inset 0 -2px 0 0 var(--tab-shadow-active);
  }
`;

const TabsHeader = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  left: 0;

  display: flex;

  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  background-color: var(--tab-bg);
  border-bottom: 1px solid var(--border);
  border-radius: inherit;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: var(--tabs-shadow);
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;

  background-color: var(--content-bg);
`;

const TabsContainer = styled.section`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  border-radius: inherit;
`;

export const DragHandler = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 8px;
  height: 80%;
  margin: auto;

  color: var(--primary);
  font-size: 14px;
  font-family: monospace;
  line-height: 6px;
  word-break: break-word;

  background-color: var(--bg);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  user-select: none;
  cursor: col-resize;

  &:hover,
  &[data-active='true'] {
    color: var(--bg);
    background-color: var(--primary);
  }
`;

const InspectorRoot = styled.div`
  :global {
  }

  position: fixed;
  right: 48px;
  top: 48px;
  bottom: 48px;

  display: flex;
  justify-content: center;

  width: 736px;
  min-width: 465px;
  max-width: 90%;

  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'PT Sans', Helvetica, Arial, sans-serif;
  line-height: 1.5;

  border-radius: 8px;

  user-select: none;

  color-scheme: light dark;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;

  @media screen and (max-width: 700px) {
    max-width: 480px;
  }
`;

// @ts-ignore
const BodyCursor = createGlobalStyles<{ isDrag: boolean }>`
  body {
    cursor: ${(props: { isDrag: boolean }) => (props.isDrag ? 'col-resize' : 'auto')};
  }
`;
