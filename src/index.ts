import {
  Store,
  CompositeName,
  createEvent,
  createStore,
  forward,
  sample,
} from 'effector';
import { using } from 'forest';
import { StyledRoot } from 'leafs';

import { Options, StoreCreator, Inspector, StoreMeta } from './types.h';
import { Root } from './view';

const storeAdd = createEvent<StoreCreator>();
const storeUpdated = createEvent<{ name: string; value: any }>();

const $stores = createStore<Record<string, StoreMeta>>({});

export function createInspector(options: Options = {}): Inspector {
  const root = document.createElement('div');
  root.classList.add('effector-inspector');

  document.body.append(root);

  using(root, () => Root($stores, options.visible));
  using(root, StyledRoot);

  return { root };
}

export function addStore(
  store: Store<any>,
  options: { mapped?: boolean; name?: string } = {},
): void {
  const name = options.name || createName(store);

  storeAdd({ store, name, mapped: options.mapped || false });

  forward({
    from: store.updates.map((value) => ({ name, value })),
    to: storeUpdated,
  });
}

const $storeValues = $stores.map((map) =>
  Object.fromEntries(
    Object.entries(map).map(([name, meta]) => [name, meta.value]),
  ),
);

$stores
  .on(storeAdd, (map, payload) => ({
    ...map,
    [payload.name]: {
      value: payload.store.getState(),
      mapped: payload.mapped,
    },
  }))
  .on(storeUpdated, (map, { name, value }) => {
    // should save the same order of fields
    map[name] = { ...map[name], value };
    return { ...map };
  });

function createName<T extends { compositeName: CompositeName }>(
  unit: T,
): string {
  return unit.compositeName.path.join('/');
}
