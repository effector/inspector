import { Store, Event, Effect } from 'effector';

export interface Options {
  trimDomain?: string;
  visible?: boolean;
}

export interface StoreCreator {
  store: Store<any>;
  name: string;
  mapped: boolean;
}

export interface EventCreator {
  event: Event<any>;
  name: string;
  mapped: boolean;
}

export interface EffectCreator {
  effect: Effect<any, any, any>;
  sid: string;
  name: string;
  attached: boolean;
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

export interface LogMeta {
  kind: 'event' | 'store' | 'effect';
  name: string;
  payload: any;
  id: string;
  datetime: Date;
}

export interface Inspector {
  root: HTMLElement;
}
