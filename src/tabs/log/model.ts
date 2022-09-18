import {createEvent, createStore, guard, createEffect} from "effector";
import { persist } from 'effector-storage/session'

import {LogMeta} from "../../types.h";


const log = createEvent<LogMeta>();
export const isLogEnabledToggle = createEvent();
export const logCleared = createEvent();

export const $logs = createStore<LogMeta[]>([], {serialize: 'ignore'});
export const $isLogEnabled = createStore(false);

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

persist({
  store: $isLogEnabled,
})
