import { createEvent, createStore } from 'effector';

type Options = {
  trimDomain?: string;
};

export const $options = createStore<Options>({});
export const setOptions = createEvent<Options>();

$options.on(setOptions, (_, options) => options);
