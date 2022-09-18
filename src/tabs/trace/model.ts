import {createEvent, createStore, guard, merge, sample} from "effector";
import { persist } from 'effector-storage/session'
import {
  StackTrace,
  TraceEffectRun,
  TraceEventTrigger,
  TraceStoreChange
} from "../../types.h";

export const traceStoreChange = createEvent<TraceStoreChange>();
export const traceEventTrigger = createEvent<TraceEventTrigger>();
export const traceEffectRun = createEvent<TraceEffectRun>();
const traceAdd = createEvent<TraceStoreChange | TraceEventTrigger | TraceEffectRun>();
const traceFinished = createEvent();
export const traceCleared = createEvent();

export const $traces = createStore<StackTrace[]>([]);
const $currentTrace = createStore<StackTrace>({ time: 0, traces: [] });
export const $isTraceEnabled = createStore(false);
export const traceEnableToggled = createEvent<void>();

$isTraceEnabled.on(traceEnableToggled, value => !value)
$traces.on([traceCleared], () => []);

$currentTrace.on(traceAdd, ({ time, traces }, trace) => ({
  time: time ? time : Date.now(),
  traces: [...traces, trace],
}));


guard({
  clock:  merge([traceStoreChange, traceEventTrigger, traceEffectRun]),
  filter: $isTraceEnabled,
  target: traceAdd
})

guard({
  source: $currentTrace,
  clock: traceAdd,
  filter: ({ traces }) => traces.length === 1,
}).watch(() => queueMicrotask(traceFinished));

const moveTrace = sample({
  clock: traceFinished,
  source: $currentTrace,
});

$traces.on(moveTrace, (stackTraces, newTrace) => [...stackTraces, newTrace]);
$currentTrace.reset(moveTrace);


persist({
  store: $isTraceEnabled,
})
