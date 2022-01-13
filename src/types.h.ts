import { Store, Event, Effect } from 'effector';

export interface Options {
  trimDomain?: string;
  visible?: boolean;
}

export interface StoreCreator {
  store: Store<any>;
  name: string;
  mapped: boolean;
  file?: string;
}

export interface EventCreator {
  event: Event<any>;
  name: string;
  mapped: boolean;
  file?: string;
}

export interface EffectCreator {
  effect: Effect<any, any, any>;
  sid: string;
  name: string;
  attached: boolean;
  file?: string;
}

export interface StoreMeta {
  value: any;
  mapped: boolean;
}

export interface EventMeta {
  mapped: boolean;
  history: any[];
}

export interface EffectMeta {
  inFlight: number;
  name: string;
  effect: Effect<any, any, any>;
}

export type Kind = 'event' | 'store' | 'effect';

export interface LogMeta {
  kind: Kind;
  name: string;
  payload: any;
  id: string;
  datetime: Date;
}

export interface Inspector {
  root: HTMLElement;
}

type FileName = string;
export type FilesMap = Record<
  FileName,
  Array<{ kind: 'store' | 'event' | 'effect'; name: string }>
>;

type Loc = {
  file: string;
  line: number;
  col: number;
};

export type TraceStoreChange = {
  type: 'store';
  name: string;
  loc?: Loc;
  before: any;
  current: any;
};

export type TraceEventTrigger = {
  type: 'event';
  name: string;
  loc?: Loc;
  argument: any;
};

export type TraceEffectRun = {
  type: 'effect';
  name: string;
  loc?: Loc;
  argument: any;
};

export type Trace = TraceStoreChange | TraceEventTrigger | TraceEffectRun;
export type StackTrace = { time: number; traces: Trace[] };
