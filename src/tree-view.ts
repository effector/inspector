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
import { using, h, spec, list, variant } from 'effector-dom';

type StoreDescriptor = { store: Store<any>; mapped: boolean };
type StoresMap = Store<Map<string, StoreDescriptor>>;

export function TreeView($stores: StoresMap) {
  h('ul', () => {
    spec({ style: styles.list });

    list(
      $stores.map((map) => [...map.entries()]),
      ({ store }) => {
        const storeValue = store.map(([, value]) => value).getState();
        const $storeName = store.map(([name]) => name);
        const $isExpanded = createStore(false);
        const expandToggle = createEvent<any>();

        $isExpanded.on(expandToggle, (is) => !is);

        JsonNode($storeName, storeValue);
      },
    );
  });
}

function JsonNode($storeName: Store<string>, value: StoreDescriptor) {
  const $type = value.store.map(getObjectType);

  h('li', () => {
    spec({ style: styles.node });

    h('pre', { text: $storeName, style: styles.nodeTitle });
    h('pre', { text: ': ', style: styles.nodeTitle });

    variant($type, {
      Object() {
        JsonObject(value.store);
      },
      Error() {
        JsonObject(value.store);
      },
      WeakMap() {
        JsonObject(value.store);
      },
      WeakSet() {
        JsonObject(value.store);
      },
      Array() {
        JsonArray(value.store);
      },
      Iterable() {
        JsonIterable(value.store);
      },
      Map() {
        JsonIterable(value.store);
      },
      Set() {
        JsonIterable(value.store);
      },
      String() {
        JsonValue(value.store, (raw) =>
          typeof raw === 'string' ? `"${raw}"` : '',
        );
      },
      Number() {
        JsonValue(value.store);
      },
      Boolean() {
        JsonValue(value.store, (raw) => (raw ? 'true' : 'false'));
      },
      Date() {
        JsonValue(value.store, (raw) => raw?.toISOString?.());
      },
      Null() {
        JsonValue(value.store, () => 'null');
      },
      Undefined() {
        JsonValue(value.store, () => 'undefined');
      },
      Function() {
        JsonValue(value.store, (raw) => raw?.toString?.());
      },
      Symbol() {
        JsonValue(value.store, (raw) => raw?.toString?.());
      },
    });
  });
}

function JsonValue<T>($value: Store<T>, getter = (raw: T) => String(raw)) {
  h('pre', () => {
    spec({ text: $value.map(getter), style: styles.nodeContent });
  });
}

function JsonObject<T extends {}>($value: Store<T>) {
  h('pre', {
    text: $value.map((value) => JSON.stringify(value)),
    style: styles.nodeContent,
  });
}

function JsonArray<T extends {}>($value: Store<T>) {
  h('pre', {
    text: $value.map((value) => JSON.stringify(value)),
    style: styles.nodeContent,
  });
}

function JsonIterable<T extends {}>($value: Store<T>) {
  h('pre', {
    text: $value.map((value) => JSON.stringify(value)),
    style: styles.nodeContent,
  });
}

function getObjectType(obj: any): string {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  if (type === 'Object' && typeof obj[Symbol.iterator] === 'function') {
    return 'Iterable';
  }

  if (
    type === 'Custom' &&
    obj.constructor !== Object &&
    obj instanceof Object
  ) {
    // For projects implementing objects overriding `.prototype[Symbol.toStringTag]`
    return 'Object';
  }

  return type;
}

const styles = {
  list: {
    listStyleType: 'none',
    margin: '0 0',
    padding: '0 0',
  },
  node: {
    display: 'flex',
    padding: '0.5rem 1rem',
    margin: '0 0',
  },
  nodeTitle: {
    display: 'flex',
    margin: '0 0',
  },
  nodeContent: {
    margin: '0 0',
  },
};
