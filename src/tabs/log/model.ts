import { combine, createEffect, createEvent, createStore, guard } from 'effector';

import { Kind, LogMeta } from '../../types.h';
import { createJsonSetting, createSetting } from '../../shared/lib/setting';

const log = createEvent<LogMeta>();
export const isLogEnabledToggle = createEvent();
export const logCleared = createEvent();

export const $logs = createStore<LogMeta[]>([], { serialize: 'ignore' });
const logsSetting = createJsonSetting('logs-enabled', false, 'session');
export const $isLogEnabled = createStore(logsSetting.read());
$isLogEnabled.watch(logsSetting.write);

type CreateRecord = Pick<LogMeta, 'name' | 'kind' | 'payload'>;

let id = 1e3;
const nextId = () => (++id).toString(36);

export const createLogRecordFx = createEffect<CreateRecord, LogMeta>({
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

$isLogEnabled.on(isLogEnabledToggle, (value) => !value);
$logs.on(log, (logs, record) => [...logs, record]).reset(logCleared);

guard({
  clock: createLogRecordFx.doneData,
  filter: $isLogEnabled,
  target: log,
});

export const toggleKind = createEvent<Kind>();
const defaultKinds: Kind[] = ['event', 'store'];
export const kindSetting = createJsonSetting<Kind[]>('filter-kinds', defaultKinds);
export const textSetting = createSetting('filter-text', '');
export const filterChanged = createEvent<string>();
export const $kinds = createStore(kindSetting.read(), { serialize: 'ignore' });
export const $filterText = createStore(textSetting.read(), { serialize: 'ignore' });

$filterText.on(filterChanged, (_, filterText) => filterText);

$kinds
  .on(toggleKind, (exist, toggled) =>
    exist.includes(toggled) ? exist.filter((i) => i !== toggled) : [...exist, toggled],
  )
  .watch(kindSetting.write);
$filterText.watch(textSetting.write);

export const $filteredLogs = combine($logs, $filterText, $kinds, (logs, text, kinds) =>
  logs.filter((log) => log.name.includes(text) && kinds.includes(log.kind)),
);
