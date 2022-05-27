import { combine, createEvent, createStore, Store } from 'effector';
import { list } from 'forest';
import { styled } from 'foliage';

import { Options, StoreMeta } from './types.h';
import { Node, NodeContent, NodeList, NodeTitle, Search } from './components';
import { ObjectView } from './object-view';
import { trimDomain } from './trim-domain';

export function Stores($stores: Store<Record<string, StoreMeta>>, options: Options) {
  const $list = $stores.map((map) =>
    Object.entries(map).map(([name, meta]) => ({ name, ...meta })),
  );

  const filterChanged = createEvent<string>();
  const $filter = createStore('', { serialize: 'ignore' });
  $filter.on(filterChanged, (_, filter) => filter);

  const $filteredList = combine($list, $filter, (list, searchWord) =>
    list.filter((item) => item.name.includes(searchWord)),
  );

  const searchChanged = filterChanged.prepend(
    (e: Event | KeyboardEvent) => (e.currentTarget as HTMLInputElement)?.value,
  );

  Header(() => {
    Search({
      attr: {
        value: $filter,
        placeholder: 'Type a part of store name',
      },
      handler: { input: searchChanged },
    });
  });

  NodeList(() => {
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

const Header = styled.div`
  padding: 6px;

  ${Search} {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }
`;
