import {createStore} from 'effector';

import {StoreMeta} from '../../types.h';

export const $stores = createStore<Record<string, StoreMeta>>({}, {serialize: 'ignore'});
