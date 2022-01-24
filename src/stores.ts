import {combine, createEvent, restore, Store} from 'effector';
import { list } from 'forest';

import { Options, StoreMeta } from './types.h';
import { Node, NodeContent, NodeList, NodeTitle, Search } from './components';
import { ObjectView } from './object-view';
import { trimDomain } from './trim-domain';

export function Stores($stores: Store<Record<string, StoreMeta>>, options: Options) {
  NodeList(() => {
    const $list = $stores.map((map) =>
      Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
    );

    const filterChanged = createEvent<string>();
    const $filter = restore(filterChanged, '');

    const $filteredList = combine($list, $filter, (list, searchWord) =>
      list.filter(item => item.name.includes(searchWord)),
    );

    const searchChanged = filterChanged.prepend(
      (e: Event | KeyboardEvent) => (e.currentTarget as HTMLInputElement)?.value,
    );

    Search({
      attr: {
        value: $filter,
        placeholder: 'Type a part of store name',
      },
      handler: { input: searchChanged },
    });

    list({
      source: $filteredList,
      key: 'name',
      fields: ['name', 'value'],
      fn({ fields: [$name, $value] }) {
        Node(() => {
          NodeTitle({ text: [trimDomain($name, options), ': '] });
          NodeContent(() => {
            ObjectView({ value: $value });
          });
        });
      },
    });
  });
}
