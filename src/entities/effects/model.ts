import { createStore } from 'effector';
import { EffectMeta } from '../../types.h';

export const $effects = createStore<Record<string, EffectMeta>>({}, { serialize: 'ignore' });
