import {
  createStore,
  createEvent,
  Store,
  Event,
  CompositeName,
} from 'effector';
import { using, h, spec } from 'forest';

import { TreeView } from './tree-view';
import { Options } from './types.h';

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

interface StoreDescriptor {
  store: Store<any>;
  mapped: boolean;
}

interface StoreCreator {
  store: Store<any>;
  mapped?: boolean;
  name?: string;
}

const storeAdd = createEvent<StoreCreator>();
const $stores = createStore<Box<StoreDescriptor>>({ map: new Map() });

$stores.on(storeAdd, ({ map }, descriptor) => {
  const name = descriptor.name ?? createName(descriptor.store);

  map.set(name, {
    store: descriptor.store,
    mapped: descriptor.mapped ?? false,
  });

  return { map };
});

function createName<T extends { compositeName: CompositeName }>(
  unit: T,
): string {
  return unit.compositeName.path.join('/');
}

export function addStore(
  store: Store<any>,
  opts: { mapped?: boolean; name?: string } = {},
): void {
  storeAdd({ store, ...opts });
}
export const addEvent = createEvent();

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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

    TreeView(
      $stores.map(({ map }) => map),
      options,
    );
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
    display: 'flex',
    flexDirection: 'column',
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
