import { Store, Event } from 'effector';

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

export interface StoreMeta {
  value: any;
  mapped: boolean;
}

export interface EventMeta {
  mapped: boolean;
}

export interface Inspector {
  root: HTMLElement;
}
