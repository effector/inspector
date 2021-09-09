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
  lastTriggeredWith: any;
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
