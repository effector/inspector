import { Store } from 'effector';

export interface Options {
  trimDomain?: string;
  visible?: boolean;
}

export interface StoreCreator {
  store: Store<any>;
  name: string;
  mapped: boolean;
}

export interface StoreMeta {
  value: any;
  mapped: boolean;
}

export interface Inspector {
  root: HTMLElement;
}
