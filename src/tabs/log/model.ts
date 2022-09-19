import {createEvent, createStore, guard, createEffect} from "effector";

import {LogMeta} from "../../types.h";
import { createJsonSetting } from "../../setting";

const log = createEvent<LogMeta>();
export const isLogEnabledToggle = createEvent();
export const logCleared = createEvent();

export const $logs = createStore<LogMeta[]>([], {serialize: 'ignore'});
const logsSetting = createJsonSetting('logs-enabled', false, sessionStorage)
export const $isLogEnabled = createStore(logsSetting.read());
$isLogEnabled.watch(logsSetting.write)

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

$isLogEnabled.on(isLogEnabledToggle, value => !value)
$logs
  .on(log, (logs, record) => [record, ...logs])
  .reset(logCleared);

guard({
  clock: createLogRecordFx.doneData,
  filter: $isLogEnabled,
  target: log
})

