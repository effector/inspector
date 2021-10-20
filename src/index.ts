import {
  CompositeName,
  createEffect,
  createEvent,
  createStore,
  Effect,
  Event,
  forward,
  Store,
  Unit,
} from 'effector';
import { using } from 'forest';
import { StyledRoot } from 'foliage';

import {
  EffectCreator,
  EffectMeta,
  EventCreator,
  EventMeta,
  FilesMap,
  Inspector,
  Kind,
  LogMeta,
  Options,
  StoreCreator,
  StoreMeta,
} from './types.h';
import { Root } from './view';

const $files = createStore<FilesMap>({});

const storeAdd = createEvent<StoreCreator>();
const storeUpdated = createEvent<{ name: string; value: any }>();
const $stores = createStore<Record<string, StoreMeta>>({});

const eventAdd = createEvent<EventCreator>();
const eventTriggered = createEvent<{ name: string; params: any }>();
const $events = createStore<Record<string, EventMeta>>({});

const effectAdd = createEvent<EffectCreator>();
const effectTriggered = createEvent<{ sid: string }>();
const $effects = createStore<Record<string, EffectMeta>>({});

const $logs = createStore<LogMeta[]>([]);

$stores
  .on(storeAdd, (map, payload) => ({
    ...map,
    [payload.name]: {
      value: payload.store.getState(),
      mapped: payload.mapped,
    },
  }))
  .on(storeUpdated, (map, { name, value }) => {
    // should not change the order of fields
    map[name] = { ...map[name], value };
    return { ...map };
  });

$files.on(storeAdd, (map, { name, file }) => {
  if (file) {
    if (map[file]) {
      const list = map[file];
      return { ...map, [file]: [...list, { kind: 'store', name }] };
    }

    return { ...map, [file]: [{ kind: 'store', name }] };
  }

  return map;
});

$events
  .on(eventAdd, (map, payload) => ({
    ...map,
    [payload.name]: {
      mapped: payload.mapped,
      history: [],
    },
  }))
  .on(eventTriggered, (map, { name, params }) => {
    // should not change the order of fields
    const safeParams = params === undefined ? undefined : JSON.parse(JSON.stringify(params));
    map[name] = {
      ...map[name],
      history: [safeParams, ...map[name].history],
    };
    return { ...map };
  });

$files.on(eventAdd, (map, { name, file }) => {
  if (file) {
    if (map[file]) {
      const list = map[file];
      return { ...map, [file]: [...list, { kind: 'event', name }] };
    }

    return { ...map, [file]: [{ kind: 'event', name }] };
  }

  return map;
});

$effects
  .on(effectAdd, (map, effect) => ({
    ...map,
    [effect.sid]: {
      name: effect.name,
      effect: effect.effect,
      inFlight: effect.effect.inFlight.getState(),
    },
  }))
  .on(effectTriggered, (map, { sid }) => {
    const fx = map[sid];
    map[sid] = {
      ...fx,
      inFlight: fx.effect.inFlight.getState(),
    };
    return { ...map };
  });

$files.on(effectAdd, (map, { name, file }) => {
  if (file) {
    if (map[file]) {
      const list = map[file];
      return { ...map, [file]: [...list, { kind: 'event', name }] };
    }

    return { ...map, [file]: [{ kind: 'event', name }] };
  }

  return map;
});

let id = 1e3;
const nextId = () => (++id).toString(36);

type CreateRecord = Pick<LogMeta, 'name' | 'kind' | 'payload'>;

const createRecordFx = createEffect<CreateRecord, LogMeta>({
  handler({ name, kind, payload }) {
    return {
      id: nextId(),
      kind,
      name,
      payload,
      datetime: new Date(),
    };
  },
});

forward({
  from: eventTriggered,
  to: createRecordFx.prepend(({ name, params }) => ({
    kind: 'event',
    name,
    payload: params,
  })),
});

forward({
  from: storeUpdated,
  to: createRecordFx.prepend(({ name, value }) => ({
    kind: 'store',
    name,
    payload: value,
  })),
});

$logs.on(createRecordFx.doneData, (logs, record) => [record, ...logs]);

export function createInspector(options: Options = {}): Inspector | undefined {
  const root = typeof document === 'object' && document.createElement('div');
  if (!root) return undefined;
  root.classList.add('effector-inspector');

  document.body.append(root);

  using(root, () => Root($stores, $events, $effects, $logs, $files, options));
  using(root, StyledRoot);

  return { root };
}

function getLocFile(unit: Unit<any>): string | undefined {
  return (unit as any).defaultConfig?.loc?.file;
}

export function addStore(
  store: Store<any>,
  options: { mapped?: boolean; name?: string } = {},
): void {
  const name = options.name || createName(store);

  storeAdd({
    store,
    name,
    mapped: options.mapped || false,
    file: getLocFile(store),
  });

  forward({
    from: store.updates.map((value) => ({ name, value })),
    to: storeUpdated,
  });
}

export function addEvent(
  event: Event<any>,
  options: { mapped?: boolean; name?: string } = {},
): void {
  const name = options.name || createName(event);

  eventAdd({
    event,
    name,
    mapped: options.mapped || false,
    file: getLocFile(event),
  });

  forward({
    from: event.map((params) => ({
      name,
      params,
    })),
    to: eventTriggered,
  });
}

export function addEffect(
  effect: Effect<any, any, any>,
  options: { attached?: boolean; sid?: string } = {},
) {
  const name = createName(effect);
  const sid = options.sid || effect.sid || name;

  effectAdd({
    effect,
    name,
    sid,
    attached: options.attached ?? false,
    file: getLocFile(effect),
  });

  forward({
    from: [effect, effect.finally],
    to: effectTriggered.prepend(() => ({ sid })),
  });

  const effectRun = effect.map((params) => ({
    kind: 'effect' as Kind,
    name,
    payload: params,
  }));

  const effectDone = effect.done.map((params) => ({
    kind: 'effect' as Kind,
    name: name + '.done',
    payload: params,
  }));

  const effectFail = effect.fail.map((params) => ({
    kind: 'effect' as Kind,
    name: name + '.fail',
    payload: params,
  }));

  forward({
    from: [effectRun, effectDone, effectFail],
    to: createRecordFx,
  });
}

function createName<T extends { compositeName: CompositeName }>(unit: T): string {
  return unit.compositeName.path.join('/');
}
