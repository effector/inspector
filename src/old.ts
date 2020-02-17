/* eslint-disable @typescript-eslint/no-use-before-define, @typescript-eslint/ban-ts-ignore, @typescript-eslint/no-unnecessary-type-assertion */
import {
  createStore,
  createEvent,
  Store,
  Event,
  Effect,
  Domain,
  createApi,
  CompositeName,
} from 'effector';
import { using, h, spec, list } from 'effector-dom';

import { TreeView } from './tree-view';

interface CompositeUnit {
  compositeName: CompositeName;
}

interface Box<T> {
  map: Map<string, T>;
}

interface Storage<T> {
  $store: Store<Box<T>>;
  api: { add: Event<T> };
}

function createStorage<T extends CompositeUnit>(name: string): Storage<T> {
  const add = createEvent<T>();
  const $store = createStore<{ map: Map<string, T> }>(
    { map: new Map() },
    { name: `$${name}Storage` },
  );

  $store.on(add, ({ map }, element: T) => {
    map.set(element.compositeName.path.join('/'), element);
    return { map };
  });

  const api = { add };

  return { $store, api };
}

const stores = createStorage<Store<any>>('stores');
const events = createStorage<Event<any>>('events');
// const effects = createStorage<Effect<any, any, any>>('effects');
// const domains = createStorage<Domain>('domain');

export const addStore = stores.api.add;
export const addEvent = events.api.add;
// export const addEffect = effects.api.add;
// export const addDomain = domains.api.add;

interface Options {
  trimDomain?: string;
  visible?: boolean;
}

export function createInspector(options: Options = {}): { root: HTMLElement } {
  const root = document.createElement('div');
  root.classList.add('effector-inspector');

  document.body.append(root);

  Root(root, options);

  return { root };
}

function Root(root: HTMLElement, options: Options): void {
  const $showInspector = createStore<boolean>(options.visible ?? false);
  const togglePressed = createEvent();
  const KeyB = 2;

  console.info(
    '%c[effector-inspector] %cPress %cCTRL+B %cto open Inspector',
    'color: gray; font-size: 1rem;',
    'color: currentColor; font-size: 1rem;',
    'color: deepskyblue; font-family: monospace; font-size: 1rem;',
    'color: currentColor; font-size: 1rem;',
  );

  $showInspector.on(togglePressed, (show) => !show);
  document.addEventListener('keypress', (event) => {
    const ev = event as KeyboardEvent;

    if (ev.keyCode === KeyB && ev.ctrlKey) {
      togglePressed();
    }
  });

  using(root, () => {
    h('div', () => {
      spec({ style: styles.root, visible: $showInspector });
      Stores(options);
    });
  });
}

const trimDomain = (domainName: string | undefined, name: string): string =>
  domainName ? name.replace(domainName + '/', '') : name;

function Stores(options: Options): void {
  h('div', { style: styles.sectionHead, text: 'Stores' });
  h('div', () => {
    spec({ style: styles.storesTable });
    list(
      stores.$store.map(({ map }) => [...map.entries()]),
      ({ store }) => {
        h('div', () => {
          spec({
            style: styles.store,
            attr: {
              title: store.map(
                ([, realStore]) =>
                  (realStore as any).defaultConfig?.loc?.file ?? '',
              ),
            },
          });

          const $name = store.map(([name]) =>
            trimDomain(options.trimDomain, name),
          );

          h('pre', () => {
            spec({
              style: styles.storeName,
              // @ts-ignore
              text: $name,
            });
          });
          h('pre', () => {
            spec({
              style: styles.storeValue,
              // @ts-ignore
              text: store.getState()[1].map((value) => JSON.stringify(value)),
            });
          });
        });
      },
    );

    TreeView();
  });
}

const styles = {
  root: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    bottom: '3rem',
    boxShadow:
      '0 14.5px 5.2px -10px rgba(0,0,0,0.038), 0 23.9px 16.6px -10px rgba(0,0,0,0.057), 0 64px 118px -10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    left: '3rem',
    overflowX: 'auto',
    position: 'fixed',
    top: '3rem',
    userSelect: 'none',
    width: '26rem',
    zIndex: 1000,
  },
  sectionHead: {
    backgroundColor: 'white',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    left: 0,
    lineHeight: '2rem',
    padding: '0.5rem 1rem',
    position: 'sticky',
    right: 0,
    top: 0,
  },
  storesTable: {
    display: 'table',
  },
  store: {
    display: 'table-row',
    fontSize: '1rem',
  },
  storeName: {
    margin: 0,
    display: 'table-cell',
    padding: '0.5rem 1rem',
  },
  storeValue: {
    margin: 0,
    display: 'table-cell',
    padding: '0.5rem 1rem',
  },
};
