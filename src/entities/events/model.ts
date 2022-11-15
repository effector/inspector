import {createStore} from 'effector';

import {EventMeta} from '../../types.h';

export const $events = createStore<Record<string, EventMeta>>({}, {serialize: 'ignore'});
